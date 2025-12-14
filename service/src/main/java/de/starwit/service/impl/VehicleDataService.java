package de.starwit.service.impl;

import java.text.DecimalFormat;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.starwit.persistence.entity.VehicleDataEntity;
import de.starwit.persistence.entity.VehicleRouteEntity;
import de.starwit.persistence.repository.VehicleDataRepository;
import de.starwit.persistence.repository.VehicleRoutesRepository;
import de.starwit.visionapi.Sae.PositionMessage;
import de.starwit.service.dto.VehicleStatisticsDTO;

@Service
public class VehicleDataService implements ServiceInterface<VehicleDataEntity, VehicleDataRepository> {

    private Logger log = LoggerFactory.getLogger(this.getClass());

    // TODO get from configuration
    ZoneId timeZone = ZoneId.of("Europe/Berlin");

    @Autowired
    private VehicleDataRepository repository;

    @Autowired
    private VehicleRoutesRepository routesRepository;

    @Autowired
    private GeometryFactory geometryFactory;

    @Override
    public VehicleDataRepository getRepository() {
        return repository;
    }

    public List<VehicleStatisticsDTO> findAllWithDistances(ZonedDateTime startTime, ZonedDateTime endTime) {
        List<VehicleStatisticsDTO> result = new ArrayList<>();
        var vehicles = repository.findAll();
        log.debug("Calculating distances for " + vehicles.size() + " vehicles");
        for (var vehicle : vehicles) {
            var dto = new VehicleStatisticsDTO(vehicle);
            result.add(dto);
        }

        var distances = routesRepository.getLenghtForAllVehiclesAndTimeFrame(startTime, endTime);

        for (Object[] row : distances) {
            Long vehicleId = ((Long) row[0]).longValue();
            Instant instant = (java.time.Instant) row[1];
            ZonedDateTime zdt = instant.atZone(timeZone);
            Double length = ((Number) row[2]).doubleValue();
            log.debug("Vehicle " + vehicleId + " on " + zdt + " length: " + length);
            for (var dto : result) {
                if (dto.getId() == vehicleId) {
                    dto.getDistances().put(zdt, Math.round(length * 100.0) / 100.0);
                    dto.getCleaningDistances().put(zdt, Math.round(length * 100.0) / 100.0);
                }
            }
        }

        return result;

    }

    public void insertOrUpdatePosition(String streamKey, PositionMessage positionMessage) {
        // extract unique part of stream key
        String[] keyParts = streamKey.split(":");
        if (keyParts.length != 2) {
            log.warn("Received position update for invalid key " + streamKey);
            return;
        }

        if (!isReasonablePositionData(positionMessage)) {
            log.warn("Received invalid position data");
            return;
        }

        String streamName = keyParts[1];

        VehicleDataEntity vehicle = repository.findByStreamKey(streamName);
        if (vehicle == null) {
            vehicle = new VehicleDataEntity();
            vehicle.setStreamKey(streamName);
            vehicle.setName(streamKey);
        }
        Point point = geometryFactory
                .createPoint(new Coordinate(
                        positionMessage.getGeoCoordinate().getLongitude(),
                        positionMessage.getGeoCoordinate().getLatitude()));
        vehicle.setLocation(point);

        Instant instant = Instant.ofEpochSecond(positionMessage.getTimestampUtcMs() / 1000);
        ZonedDateTime z = ZonedDateTime.ofInstant(instant, timeZone);
        vehicle.setLastUpdate(z);
        vehicle = repository.save(vehicle);

        VehicleRouteEntity route = new VehicleRouteEntity();
        route.setVehicleData(vehicle);
        route.setLocation(point);
        route.setUpdateTimestamp(z);
        routesRepository.save(route);
    }

    private boolean isReasonablePositionData(PositionMessage message) {
        // prevent zero coordinates
        if (message.getGeoCoordinate().getLatitude() == 0 && message.getGeoCoordinate().getLongitude() == 0) {
            return false;
        }

        // prevent too old timestamps
        Instant instant = Instant.ofEpochSecond(message.getTimestampUtcMs() / 1000);
        ZonedDateTime z = ZonedDateTime.ofInstant(instant, timeZone);
        ZonedDateTime now = ZonedDateTime.now(timeZone);

        if (z.getYear() < now.getYear()) {
            return false;
        }

        return true;
    }
}
