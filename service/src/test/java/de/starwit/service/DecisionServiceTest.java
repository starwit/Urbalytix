package de.starwit.service;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.annotation.Commit;
import org.springframework.transaction.annotation.Transactional;

import de.starwit.aic.model.Decision;
import de.starwit.persistence.entity.ActionEntity;
import de.starwit.persistence.entity.ActionTypeEntity;
import de.starwit.persistence.entity.DecisionEntity;
import de.starwit.persistence.entity.DecisionState;
import de.starwit.persistence.entity.DecisionTypeEntity;
import de.starwit.persistence.entity.ExecutionPolicy;
import de.starwit.persistence.entity.ModuleEntity;
import de.starwit.persistence.repository.ActionRepository;
import de.starwit.persistence.repository.ActionTypeRepository;
import de.starwit.persistence.repository.DecisionTypeRepository;
import de.starwit.service.impl.DecisionService;
import de.starwit.service.impl.DecisionTypeService;
import de.starwit.service.impl.ModuleService;
import de.starwit.service.mapper.DecisionMapper;
import jakarta.persistence.EntityNotFoundException;

@Import(TestServiceConfiguration.class)
@Transactional
@SpringBootTest
public class DecisionServiceTest {

        @Autowired
        private DecisionService decisionService;

        private static Long decisionId;

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
                decisionTypeService.saveOrUpdate(defaultDecisionType);

                // Call-Methode
                DecisionEntity entity = decisionService.saveOrUpdate(decision);

                // Assert
                assertTrue(entity.description().equals("Testdescription"));

                DecisionEntity foundDecision = decisionService.findById(entity.getId());
                assertNotNull(foundDecision);
                assertEquals("Testdescription", foundDecision.getDescription());

                List<DecisionEntity> allDecisions = decisionService.findAll();
                assertNotNull(allDecisions);
                assertFalse(allDecisions.isEmpty());
                assertTrue(allDecisions.size() == 1);
        }
}
