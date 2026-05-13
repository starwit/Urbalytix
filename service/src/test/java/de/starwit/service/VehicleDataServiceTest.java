package de.starwit.service;

import static org.mockito.Mockito.*;

import org.junit.jupiter.api.Test;
import org.locationtech.jts.geom.GeometryFactory;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import de.starwit.persistence.entity.VehicleRouteEntity;
import de.starwit.persistence.repository.VehicleDataRepository;
import de.starwit.persistence.repository.VehicleRoutesRepository;
import de.starwit.service.impl.VehicleDataService;
import de.starwit.visionapi.Common.GeoCoordinate;
import de.starwit.visionapi.Common.MovementVector;
import de.starwit.visionapi.Sae.PositionMessage;

@SpringBootTest(classes = { VehicleDataService.class, GeometryFactory.class })
public class VehicleDataServiceTest {

    @MockitoBean
    private VehicleDataRepository dataRepository;

    @MockitoBean
    private VehicleRoutesRepository routesRepository;

    @Autowired
    private VehicleDataService testee;

    @Test
    public void testInsertOrUpdatePosition() {

        testee.insertOrUpdatePosition("test:test", createPosMsg(0, 52.0, 10.0, createMoveVec(50.0, 90.0)));

        ArgumentCaptor<VehicleRouteEntity> routeCaptor = ArgumentCaptor.forClass(VehicleRouteEntity.class);
        
        verify(routesRepository, times(1)).save(routeCaptor.capture());
        
        VehicleRouteEntity route = routeCaptor.getValue();
        assert route.getUpdateTimestamp().toInstant().toEpochMilli() == 0;
        assert route.getLocation().getX() == 10.0;
        assert route.getLocation().getY() == 52.0;
        assert route.getSpeedKmh().doubleValue() == 50.0;
        assert route.getHeadingDeg().doubleValue() == 90.0;
    }

    @Test
    public void testInsertOrUpdatePositionNoMovementVector() {

        testee.insertOrUpdatePosition("test:test", createPosMsg(0, 52.0, 10.0, null));

        ArgumentCaptor<VehicleRouteEntity> routeCaptor = ArgumentCaptor.forClass(VehicleRouteEntity.class);
        
        verify(routesRepository, times(1)).save(routeCaptor.capture());
        
        VehicleRouteEntity route = routeCaptor.getValue();
        assert route.getUpdateTimestamp().toInstant().toEpochMilli() == 0;
        assert route.getLocation().getX() == 10.0;
        assert route.getLocation().getY() == 52.0;
        assert route.getSpeedKmh() == null;
        assert route.getHeadingDeg() == null;
    }

    @Test
    public void testInsertOrUpdatePositionInvalid() {
        testee.insertOrUpdatePosition("test:test", createPosMsg(0, 52.0, 10.0, createMoveVec(-10.0, 90.0)));
        testee.insertOrUpdatePosition("test:test", createPosMsg(0, 52.0, 10.0, createMoveVec(999999.0, 90.0)));
        testee.insertOrUpdatePosition("test:test", createPosMsg(0, 0, 0, createMoveVec(10.0, 90.0)));

        verify(routesRepository, times(0)).save(any());
    }

    private PositionMessage createPosMsg(long timestampUtcMs, double latitude, double longitude, MovementVector movementVector) {
        PositionMessage.Builder messageBuilder = PositionMessage.newBuilder()
                .setTimestampUtcMs(timestampUtcMs)
                .setGeoCoordinate(GeoCoordinate.newBuilder()
                        .setLatitude(latitude)
                        .setLongitude(longitude)
                        .build());

        if (movementVector != null) {
            messageBuilder.setMovementVector(movementVector);
        }

        return messageBuilder.build();
    }

    private MovementVector createMoveVec(double speedKmh, double headingDeg) {
        return MovementVector.newBuilder()
                .setSpeedKmh(speedKmh)
                .setHeadingDeg(headingDeg)
                .build();
    }
}
