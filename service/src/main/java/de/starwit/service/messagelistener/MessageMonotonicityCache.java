package de.starwit.service.messagelistener;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import de.starwit.persistence.entity.VehicleDataEntity;
import de.starwit.persistence.repository.VehicleDataRepository;

@Scope(value = ConfigurableBeanFactory.SCOPE_SINGLETON)
@Component
public class MessageMonotonicityCache {

    @Autowired
    private VehicleDataRepository vehicleDataRepository;

    @Value("${spring.data.stream.drop-non-monotonic-timestamps:true}")
    private boolean enabled;

    private Map<String, Long> lastTimestampByStreamKey = new ConcurrentHashMap<>();

    public record CheckTimestampResult(Boolean accepted, Long timestampSkew) {
    }

    /**
     * Check timestamp monotonicity for the given stream, by attempting to advance 
     * the monotonic sequence to the given timestamp.
     * A timestamp is accepted (i.e. returns {@code accepted==true}) if and only if it is greater than the
     * last accepted timestamp. In all other cases {@code accepted==false} is returned.
     * Additionally the timestamp skew (i.e. the difference to the latest timestamp)
     * is reported in {@code timestampSkew}
     * This is thread-safe and explicitly meant to be shared across threads.
     */
    public CheckTimestampResult checkTimestamp(String streamKey, Long newTimestamp) {
        if (!this.enabled) {
            return new CheckTimestampResult(true, 0L);
        }

        lazyInit(streamKey);

        // Attempt to update the timestamp
        Long updatedTimestamp = lastTimestampByStreamKey.merge(streamKey, newTimestamp,
                (existingTs, newTs) -> newTs > existingTs ? newTs : existingTs);

        Boolean accepted = updatedTimestamp == newTimestamp;
        Long skew = updatedTimestamp - newTimestamp;

        return new CheckTimestampResult(accepted, skew);
    }

    /**
     * Attempts to initialize the streams last timestamp from the database.
     * Is a very cheap operation if the stream key is already present.
     */
    private void lazyInit(String streamKey) {
        // The comparatively slow mappingFunction can block other map operations and
        // thereby other threads
        // but as it only happens once per stream during the entire application runtime,
        // this is tolerable
        lastTimestampByStreamKey.computeIfAbsent(streamKey, key -> {
            VehicleDataEntity vehicleData = vehicleDataRepository.findByStreamKey(streamKey.split(":")[1]);
            if (vehicleData != null && vehicleData.getLastUpdate() != null) {
                return vehicleData.getLastUpdate().toInstant().toEpochMilli();
            } else {
                return 0L;
            }
        });
    }
}
