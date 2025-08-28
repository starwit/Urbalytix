package de.starwit.service.messagelistener;

import java.util.Base64;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.stream.MapRecord;
import org.springframework.data.redis.stream.StreamListener;
import org.springframework.stereotype.Service;

import com.google.protobuf.InvalidProtocolBufferException;

import de.starwit.service.impl.VehicleDataService;
import de.starwit.visionapi.Sae.PositionMessage;

@Service
public class PositionMessageListener implements StreamListener<String, MapRecord<String, String, String>> {

    private Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private VehicleDataService service;

    @Override
    public void onMessage(MapRecord<String, String, String> message) {
        log.debug(String.format("execute thread: %s %s",
                Thread.currentThread().getName(), Thread.currentThread().threadId()));

        PositionMessage positionMessage;

        log.debug("Received position message from " + message.getStream());

        String b64Proto = message.getValue().get("proto_data_b64");

        try {
            positionMessage = PositionMessage.parseFrom(Base64.getDecoder().decode(b64Proto));
            service.insertOrUpdatePosition(message.getStream(), positionMessage);
        } catch (InvalidProtocolBufferException e) {
            log.warn("Received invalid proto");
            return;
        }
    }
}
