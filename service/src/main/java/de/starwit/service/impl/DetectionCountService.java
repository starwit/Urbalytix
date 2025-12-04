package de.starwit.service.impl;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import de.starwit.persistence.dto.DistrictWithDetectionCountDto;
import de.starwit.persistence.entity.DetectionCountEntity;
import de.starwit.persistence.repository.DetectionCountRepository;
import de.starwit.persistence.repository.StreetCatalogRepository;
import de.starwit.visionapi.Analytics.DetectionCount;
import de.starwit.visionapi.Analytics.DetectionCountMessage;

@Service
public class DetectionCountService implements ServiceInterface<DetectionCountEntity, DetectionCountRepository> {

    @Autowired
    private DetectionCountRepository repository;

    @Autowired
    private StreetCatalogRepository streetCatalogRepository;

    @Autowired
    private GeometryFactory geometryFactory;

    @Override
    public DetectionCountRepository getRepository() {
        return repository;
    }

    public List<String> getAllDetectedObjectClasses(ZonedDateTime startTime, ZonedDateTime endTime) {
        List<String> classNames = repository.findDistinctClassNames(startTime, endTime);
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
                Point point = geometryFactory
                        .createPoint(new Coordinate(dto.getLocation().getLongitude(), dto.getLocation().getLatitude()));
                entity.setLocation(point);
            } else {
                entity.setLocation(null);
            }
            entity.setClassName(dto.getClassName());
            entity.setCount(dto.getCount());
            repository.save(entity);
        }
    }

    public List<DetectionCountEntity> findAllLimited(int amount) {
        Page<DetectionCountEntity> p = repository.findAll(PageRequest.of(0, amount));
        List<DetectionCountEntity> entities = p.toList();
        return entities;
    }

    public List<DetectionCountEntity> getDataFromTimeFrame(ZonedDateTime startTime, ZonedDateTime endTime) {
        List<DetectionCountEntity> entities = repository.findByDetectionTimeBetween(startTime, endTime);
        return entities;
    }

    public List<DistrictWithDetectionCountDto> getDataByDistrictAndTimeframe(ZonedDateTime startTime,
            ZonedDateTime endTime) {
        List<DistrictWithDetectionCountDto> entities = repository.findByDistrictInTimeframe(startTime, endTime);
        return entities;
    }

    public List<DetectionCountEntity> getDataByStreetName(String streetName) {
        Geometry street = streetCatalogRepository.findStreet(streetName);
        if (street == null) {
            return java.util.Collections.emptyList();
        }
        List<DetectionCountEntity> entities = repository.findByStreet(street);
        return entities;
    }

}
