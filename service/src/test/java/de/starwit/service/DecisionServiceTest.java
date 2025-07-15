package de.starwit.service;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.annotation.Commit;
import org.springframework.transaction.annotation.Transactional;

import de.starwit.persistence.entity.DecisionEntity;
import de.starwit.service.impl.DecisionService;

@Import(TestServiceConfiguration.class)
@Transactional
@SpringBootTest
public class DecisionServiceTest {

        @Autowired
        private DecisionService decisionService;

        @Test
        @Commit
        @Order(1)
        void testCreateDecision() {
                // prepare
                DecisionEntity decision = new DecisionEntity();
                decision.setAcquisitionTime(ZonedDateTime.ofInstant(Instant.now(), ZoneId.systemDefault()));
                decision.setCameraLatitude(new BigDecimal("48.123456"));
                decision.setCameraLongitude(new BigDecimal("11.123456"));
                decision.setDescription("Testdescription");

                // Call-Methode
                DecisionEntity entity = decisionService.saveOrUpdate(decision);

                // Assert
                assertTrue(entity.getDescription().equals("Testdescription"));

                DecisionEntity foundDecision = decisionService.findById(entity.getId());
                assertNotNull(foundDecision);
                assertEquals("Testdescription", foundDecision.getDescription());

                List<DecisionEntity> allDecisions = decisionService.findAll();
                assertNotNull(allDecisions);
                assertFalse(allDecisions.isEmpty());
                assertTrue(allDecisions.size() == 1);
        }
}
