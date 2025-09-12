package de.starwit.service.impl;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.starwit.persistence.entity.VehicleDataEntity;
import de.starwit.persistence.entity.VehicleRouteEntity;
import de.starwit.persistence.repository.VehicleDataRepository;
import de.starwit.persistence.repository.VehicleRoutesRepository;
import de.starwit.visionapi.Sae.PositionMessage;

@Service
public class VehicleDataService implements ServiceInterface<VehicleDataEntity, VehicleDataRepository> {

    private Logger log = LoggerFactory.getLogger(this.getClass());

    ZoneId timeZone = ZoneId.of("America/New_York");

    @Autowired
    private VehicleDataRepository repository;

    @Autowired
    private VehicleRoutesRepository routesRepository;

    @Override
    public VehicleDataRepository getRepository() {
        return repository;
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

        var vehicle = repository.findByStreamKey(streamName);
        if (vehicle == null) {
            vehicle = new VehicleDataEntity();
            vehicle.setStreamKey(streamName);
            vehicle.setName(streamKey);
        }
        vehicle.setLatitude(new BigDecimal(positionMessage.getGeoCoordinate().getLatitude()));
        vehicle.setLongitude(new BigDecimal(positionMessage.getGeoCoordinate().getLongitude()));

        Instant instant = Instant.ofEpochSecond(positionMessage.getTimestampUtcMs() / 1000);
        ZonedDateTime z = ZonedDateTime.ofInstant(instant, timeZone);
        vehicle.setLastUpdate(z);
        vehicle = repository.save(vehicle);

        VehicleRouteEntity route = new VehicleRouteEntity();
        route.setVehicleData(vehicle);
        route.setLatitude(new BigDecimal(positionMessage.getGeoCoordinate().getLatitude()));
        route.setLongitude(new BigDecimal(positionMessage.getGeoCoordinate().getLongitude()));
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
