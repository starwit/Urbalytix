package de.starwit.service.messagelistener;

import java.util.Base64;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.stream.MapRecord;
import org.springframework.data.redis.stream.StreamListener;
import org.springframework.stereotype.Service;

import com.google.protobuf.InvalidProtocolBufferException;

import de.starwit.service.impl.DetectionCountService;
import de.starwit.visionapi.Analytics.DetectionCountMessage;

@Service
public class DetectionCountMessageListener implements StreamListener<String, MapRecord<String, String, String>> {

    private Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private DetectionCountService service;

    @Override
    public void onMessage(MapRecord<String, String, String> message) {
        log.info("DetectionCount message received.");
        log.debug(String.format("execute thread: %s %s",
                Thread.currentThread().getName(), Thread.currentThread().threadId()));

        String b64Proto = message.getValue().get("proto_data_b64");
        DetectionCountMessage detectionCountMessage;

        try {
            detectionCountMessage = DetectionCountMessage.parseFrom(Base64.getDecoder().decode(b64Proto));
            service.createDetectionCountFromRedis(detectionCountMessage);
        } catch (InvalidProtocolBufferException e) {
            log.warn("Received invalid proto");
            return;
        }
    }
}
