package de.starwit.service.impl;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Limit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import de.starwit.persistence.entity.DetectionCountEntity;
import de.starwit.persistence.repository.DetectionCountRepository;
import de.starwit.persistence.repository.ObjectClassRepository;
import de.starwit.visionapi.Analytics.DetectionCount;
import de.starwit.visionapi.Analytics.DetectionCountMessage;

@Service
public class DetectionCountService implements ServiceInterface<DetectionCountEntity, DetectionCountRepository> {

    @Autowired
    private DetectionCountRepository repository;

    @Autowired
    private ObjectClassRepository objectClassRepository;

    @Override
    public DetectionCountRepository getRepository() {
        return repository;
    }

    public List<Long> getAllDetectedObjectClasses() {
        return repository.findDistinctClassIds();
    }

    public Map<String, Long> getAllDetectedObjectClassesWithNames() {
        Map<String, Long> result = new HashMap<>();

        var allClasses = objectClassRepository.findAll();
        var foundClasses = repository.findDistinctClassIds();
        for (Long classId : foundClasses) {
            allClasses.stream().filter(c -> c.getClassId().equals(Math.toIntExact(classId))).findFirst()
                    .ifPresent(c -> {
                        result.put(c.getName(), classId);
                    });
        }

        return result;
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

    public List<DetectionCountEntity> findAllLimited(int amount) {
        Page<DetectionCountEntity> p = repository.findAll(PageRequest.of(0, amount));
        return p.toList();
    }

    public List<DetectionCountEntity> getDataFromTimeFrame(ZonedDateTime startTime, ZonedDateTime endTime) {
        return repository.findByDetectionTimeBetween(startTime, endTime);
    }
}
