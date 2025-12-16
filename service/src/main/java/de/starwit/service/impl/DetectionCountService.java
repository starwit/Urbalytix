package de.starwit.service.impl;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import de.starwit.persistence.dto.DistrictWithDetectionCountDto;
import de.starwit.persistence.dto.StreetsWithDetectionCountDto;
import de.starwit.persistence.entity.CityDistrictEntity;
import de.starwit.persistence.entity.DetectionCountEntity;
import de.starwit.persistence.entity.StreetCatalogEntity;
import de.starwit.persistence.repository.CityDistrictRepository;
import de.starwit.persistence.repository.DetectionCountRepository;
import de.starwit.persistence.repository.StreetCatalogRepository;
import de.starwit.visionapi.Analytics.DetectionCount;
import de.starwit.visionapi.Analytics.DetectionCountMessage;

@Service
public class DetectionCountService implements ServiceInterface<DetectionCountEntity, DetectionCountRepository> {

    private final static Logger log = LoggerFactory.getLogger(DetectionCountService.class);

    @Autowired
    private DetectionCountRepository repository;

    @Autowired
    private CityDistrictRepository districtRepository;

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
        // if no results, send a district list with 0 values
        if (entities.size() == 0) {
            var districts = districtRepository.findAll();
            log.debug("Adding empty values for " + districts.size() + " districts");
            List<DistrictWithDetectionCountDto> emptyEntities = new ArrayList<>();
            for (var district : districts) {
                emptyEntities.add(new DistrictWithDetectionCountDto(district.getId(), district.getName(), "waste", 0));
            }
            entities = emptyEntities;
        }
        return entities;
    }

    public List<StreetsWithDetectionCountDto> getDataForStreetsByDistrictAndTimeframe(ZonedDateTime startTime,
            ZonedDateTime endTime, long districtId) {
        List<StreetsWithDetectionCountDto> result = new ArrayList<>();

        String districtName = "";
        Optional<CityDistrictEntity> districtEntity = districtRepository.findById(districtId);
        if (!districtEntity.isEmpty()) {
            districtName = districtEntity.get().getName();
        }

        List<StreetCatalogEntity> streets = streetCatalogRepository.findByCityDistrictId("Wolfsburg", districtId);
        log.debug("Found " + streets.size() + " streets for district " + districtId);
        for (StreetCatalogEntity street : streets) {
            Geometry streetHull = streetCatalogRepository.findStreetHull(street.getId());

            int wasteCount = repository.countByGeometry(streetHull, startTime, endTime);
            StreetsWithDetectionCountDto streetDto = new StreetsWithDetectionCountDto(street.getId(),
                    street.getStreetName(), districtName, wasteCount);

            result.add(streetDto);
        }
        return result;
    }

    public List<DetectionCountEntity> getDataByStreetName(long streetId) {
        Geometry street = streetCatalogRepository.findStreetHull(streetId);
        if (street == null) {
            return java.util.Collections.emptyList();
        }
        List<DetectionCountEntity> entities = repository.findByStreet(street);
        return entities;
    }

}
