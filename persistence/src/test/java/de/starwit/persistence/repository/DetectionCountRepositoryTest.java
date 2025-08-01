package de.starwit.persistence.repository;

import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import de.starwit.persistence.entity.DetectionCountEntity;

@DataJpaTest
public class DetectionCountRepositoryTest {

    @Autowired
    private DetectionCountRepository repository;

    @Test
    public void testFindAll() {
        List<DetectionCountEntity> all = repository.findAll();
        assertTrue(all.isEmpty());
    }
}
