package de.starwit.service.impl;

import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.connection.stream.MapRecord;
import org.springframework.data.redis.connection.stream.ReadOffset;
import org.springframework.data.redis.connection.stream.StreamOffset;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.stream.StreamMessageListenerContainer;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import de.starwit.service.messagelistener.DetectionCountMessageListener;
import de.starwit.service.messagelistener.DetectionMessageListener;
import de.starwit.service.messagelistener.PositionMessageListener;
import jakarta.annotation.PostConstruct;

@Service
public class StreamSubscriptionService {

    private Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private RedisTemplate<String, ?> redisTemplate;

    @Value("${spring.data.redis.active:false}")
    private Boolean activateRedis;

    @Value("${spring.data.stream.aggregator:aggregator}")
    private String streamPrefixAggregator;

    @Value("${spring.data.stream.positionsource:positionsource}")
    private String streamPrefixPositionSource;

    @Value("${spring.data.stream.detection:objectdetector}")
    private String streamPrefixDetection;

    private Map<String, List<String>> keysPerStream = new HashMap<>();
    private Set<String> subscribedStreams = new HashSet<>();

    @Autowired(required = false)
    StreamMessageListenerContainer<String, MapRecord<String, String, String>> streamMessageListenerContainer;

    @Autowired
    DetectionCountMessageListener detectionCountMessageListener;

    @Autowired
    PositionMessageListener positionMessageListener;

    @Autowired
    DetectionMessageListener detectionMessageListener;

    @PostConstruct
    private void prePopulateStreamKeys() {
        keysPerStream.put(streamPrefixAggregator, new LinkedList<>());
        keysPerStream.put(streamPrefixPositionSource, new LinkedList<>());
        keysPerStream.put(streamPrefixDetection, new LinkedList<>());
        log.debug("Scanning message bus for streams: " + keysPerStream.keySet().toString());
    }

    @Scheduled(fixedDelay = 5000)
    public void detectStreamsAndResubscribe() {
        if (streamMessageListenerContainer == null || activateRedis == false)
            return;

        rescanStreams(keysPerStream);

        for (String key : keysPerStream.get(streamPrefixAggregator)) {
            String streamName = streamPrefixAggregator + ":" + key;
            if (!subscribedStreams.contains(streamName)) {
                log.debug("Subscribing to " + streamName);
                StreamOffset<String> streamOffset = StreamOffset.create(streamName, ReadOffset.latest());
                streamMessageListenerContainer.receive(streamOffset, detectionCountMessageListener);
                subscribedStreams.add(streamName);
            }
        }

        for (String key : keysPerStream.get(streamPrefixPositionSource)) {
            String streamName = streamPrefixPositionSource + ":" + key;
            if (!subscribedStreams.contains(streamName)) {
                log.debug("Subscribing to " + streamName);
                StreamOffset<String> streamOffset = StreamOffset.create(streamName, ReadOffset.latest());
                streamMessageListenerContainer.receive(streamOffset, positionMessageListener);
                subscribedStreams.add(streamName);
            }
        }

        for (String key : keysPerStream.get(streamPrefixDetection)) {
            String streamName = streamPrefixDetection + ":" + key;
            if (!subscribedStreams.contains(streamName)) {
                log.debug("Subscribing to " + streamName);
                StreamOffset<String> streamOffset = StreamOffset.create(streamName, ReadOffset.latest());
                streamMessageListenerContainer.receive(streamOffset, detectionMessageListener);
                subscribedStreams.add(streamName);
            }
        }

        if (!streamMessageListenerContainer.isRunning()) {
            streamMessageListenerContainer.start();
        }
    }

    public void rescanStreams(Map<String, List<String>> keysPerStream) {
        log.info("Re-scanning for streams");
        List<String> streamKeys = getAllStreamKeys();
        log.info("Found {} streams", streamKeys.size());
        for (String streamKey : streamKeys) {
            String stream = streamKey.split(":")[0];
            String streamId = streamKey.split(":")[1];
            log.debug(stream + ":" + streamId + " - " + streamKey);
            List<String> list = keysPerStream.get(stream);
            if (list != null) {
                insertOrUpdateStreamIds(list, streamId);
            } else {
                log.debug("Ignored stream " + stream);
            }
        }
        log.debug(toStringAllKeys(keysPerStream));
    }

    private void insertOrUpdateStreamIds(List<String> list, String streamId) {
        for (String s : list) {
            if (s.equalsIgnoreCase(streamId)) {
                return;
            }
        }
        list.add(streamId);
    }

    private String toStringAllKeys(Map<String, List<String>> keysPerStream) {
        StringBuilder sb = new StringBuilder();
        for (String key : keysPerStream.keySet()) {
            sb.append(key + ": ");
            for (String s : keysPerStream.get(key)) {
                sb.append(s + " ");
            }
            sb.append("\n");
        }
        return sb.toString();
    }

    private List<String> getAllStreamKeys() {
        List<String> result = new LinkedList<>();
        Set<String> allKeys = redisTemplate.keys("*");
        result.addAll(allKeys);
        return result;
    }

    public Map<String, List<String>> getKeysPerStream() {
        return keysPerStream;
    }
}
