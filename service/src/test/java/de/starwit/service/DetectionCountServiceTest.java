package de.starwit.service;

import static org.junit.jupiter.api.Assertions.*;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.annotation.Commit;
import org.springframework.transaction.annotation.Transactional;

import de.starwit.persistence.entity.DetectionCountEntity;
import de.starwit.service.impl.DetectionCountService;

@Import(TestServiceConfiguration.class)
@Transactional
@SpringBootTest
public class DetectionCountServiceTest {

        @Autowired
        private DetectionCountService detectionCountService;

        @Autowired
        private GeometryFactory geometryFactory;

        @Test
        @Commit
        @Order(1)
        void testCreateDetectionCount() {
                // prepare
                DetectionCountEntity detectionCount = new DetectionCountEntity();
                detectionCount.setDetectionTime(ZonedDateTime.ofInstant(Instant.now(), ZoneId.systemDefault()));
                Point point = geometryFactory
                                .createPoint(new Coordinate(11.123456, 48.123456));
                detectionCount.setLocation(point);
                detectionCount.setClassName("waste");
                detectionCount.setCount(5);

                // Call-Methode
                DetectionCountEntity entity = detectionCountService.saveOrUpdate(detectionCount);

                // Assert
                assertEquals(5, entity.getCount());

                DetectionCountEntity found = detectionCountService.findById(entity.getId());
                assertNotNull(found);
                assertEquals(5, found.getCount());

                List<DetectionCountEntity> all = detectionCountService.findAll();
                assertNotNull(all);
                assertFalse(all.isEmpty());
                assertTrue(all.size() == 1);
        }
}
