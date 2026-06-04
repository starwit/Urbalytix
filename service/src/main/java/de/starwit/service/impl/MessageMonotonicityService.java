package de.starwit.service.impl;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

@Service
public class MessageMonotonicityService {

    private Map<String, Long> lastTimestampByStreamKey = new ConcurrentHashMap<>();

    public record AdvanceTimestampResult(Boolean accepted, Long timestampSkew) {}

    /**
     * Attempts to advance the monotonic sequence for the given stream key to the given timestamp.
     * A timestamp is accepted (i.e. returns {@code true}) if and only if it is greater than the
     * last accepted timestamp. In all other cases {@code false} is returned.
     * This is thread-safe.
     */
    public AdvanceTimestampResult advanceTimestamp(String streamKey, Long newTimestamp) {
        // Attempt to update the timestamp
        Long updatedTimestamp = lastTimestampByStreamKey.merge(streamKey, newTimestamp, 
            (currentTs, newTs) -> newTs > currentTs ? newTs : currentTs
        );

        Boolean accepted = updatedTimestamp == newTimestamp;
        Long skew = updatedTimestamp - newTimestamp;

        return new AdvanceTimestampResult(accepted, skew);
    }
}
