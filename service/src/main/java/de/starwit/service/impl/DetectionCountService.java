package de.starwit.service.impl;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import de.starwit.persistence.entity.DetectionCountEntity;
import de.starwit.persistence.repository.DetectionCountRepository;
import de.starwit.visionapi.Analytics.DetectionCount;
import de.starwit.visionapi.Analytics.DetectionCountMessage;

@Service
public class DetectionCountService implements ServiceInterface<DetectionCountEntity, DetectionCountRepository> {

    ZonedDateTime cutoffDate = ZonedDateTime.now().minusDays(14);

    @Autowired
    private DetectionCountRepository repository;

    @Override
    public DetectionCountRepository getRepository() {
        return repository;
    }

    public List<String> getAllDetectedObjectClasses() {
        List<String> classNames = repository.findDistinctClassNames(cutoffDate);
        return classNames;
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
            entity.setClassName(dto.getClassName());
            entity.setCount(dto.getCount());
            repository.save(entity);
        }
    }

    public List<DetectionCountEntity> findAllLimited(int amount) {
        Page<DetectionCountEntity> p = repository.findAll(PageRequest.of(0, amount));
        return p.toList();
    }

    public List<DetectionCountEntity> getDataFromTimeFrame(ZonedDateTime startTime, ZonedDateTime endTime) {
        List<DetectionCountEntity> entities = repository.findByDetectionTimeBetween(startTime, endTime);
        return entities;
    }
}
