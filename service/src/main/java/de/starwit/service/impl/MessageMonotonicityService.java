package de.starwit.service.impl;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.starwit.persistence.entity.VehicleDataEntity;
import de.starwit.persistence.repository.VehicleDataRepository;

@Service
public class MessageMonotonicityService {

    @Autowired
    private VehicleDataRepository vehicleDataRepository;

    private Map<String, Long> lastTimestampByStreamKey = new ConcurrentHashMap<>();

    public record AdvanceTimestampResult(Boolean accepted, Long timestampSkew) {}

    /**
     * Attempts to advance the monotonic sequence for the given stream key to the given timestamp.
     * A timestamp is accepted (i.e. returns {@code accepted==true}) if and only if it is greater than the
     * last accepted timestamp. In all other cases {@code accepted==false} is returned.
     * Additionally the timestamp skew (i.e. the difference to the latest timestamp) is
     * reported in {@code timestampSkew}
     * This is thread-safe and explicitly meant to be shared across threads.
     */
    public AdvanceTimestampResult advanceTimestamp(String streamKey, Long newTimestamp) {
        lazyInit(streamKey);
        
        // Attempt to update the timestamp
        Long updatedTimestamp = lastTimestampByStreamKey.merge(streamKey, newTimestamp, 
            (currentTs, newTs) -> newTs > currentTs ? newTs : currentTs
        );

        Boolean accepted = updatedTimestamp == newTimestamp;
        Long skew = updatedTimestamp - newTimestamp;

        return new AdvanceTimestampResult(accepted, skew);
    }

    /**
     * Attempts to initialize the streams last timestamp from the database.
     * Is a very cheap operation if the stream key is already present.
     */
    private void lazyInit(String streamKey) {
        // The comparatively slow mappingFunction can block other map operations and thereby other threads
        // but as it only happens once per stream during the entire application runtime, this is tolerable
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
