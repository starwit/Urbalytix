package de.starwit.service.messagelistener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.connection.stream.MapRecord;
import org.springframework.data.redis.stream.StreamListener;
import org.springframework.stereotype.Service;

@Service
public class DetectionMessageListener implements StreamListener<String, MapRecord<String, String, String>> {

    private Logger log = LoggerFactory.getLogger(this.getClass());

    @Override
    public void onMessage(MapRecord<String, String, String> message) {
        log.debug("Detection Message received - processing not implemented yet");
    }
}
