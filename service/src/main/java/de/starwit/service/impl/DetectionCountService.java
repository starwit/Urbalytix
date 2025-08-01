package de.starwit.service.impl;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.starwit.persistence.entity.DetectionCountEntity;
import de.starwit.persistence.repository.DetectionCountRepository;
import de.starwit.visionapi.Analytics.DetectionCount;
import de.starwit.visionapi.Analytics.DetectionCountMessage;

@Service
public class DetectionCountService implements ServiceInterface<DetectionCountEntity, DetectionCountRepository> {

    @Autowired
    private DetectionCountRepository repository;

    @Override
    public DetectionCountRepository getRepository() {
        return repository;
    }

    public void createDetectionCountFromRedis(DetectionCountMessage message) {
        if (message == null || message.getDetectionCountsList().isEmpty()) {
            return; // No data to process
        }

        for (DetectionCount dto : message.getDetectionCountsList()) {
            DetectionCountEntity entity = new DetectionCountEntity();
            ZonedDateTime dateTime = Instant.ofEpochMilli(message.getTimestampUtcMs())
                    .atZone(ZoneId.systemDefault());
            entity.setDetectionTime(dateTime);
            if (dto.hasLocation()) {
                entity.setLatitude(new BigDecimal(dto.getLocation().getLatitude()));
                entity.setLongitude(new BigDecimal(dto.getLocation().getLongitude()));
            } else {
                entity.setLatitude(null);
                entity.setLongitude(null);
            }
            entity.setClassId(dto.getClassId());
            entity.setCount(dto.getCount());
            repository.save(entity);
        }
    }
}
