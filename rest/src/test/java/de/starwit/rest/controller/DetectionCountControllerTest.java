package de.starwit.rest.controller;

import de.starwit.persistence.entity.DetectionCountEntity;
import de.starwit.service.impl.DetectionCountService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import org.junit.jupiter.api.BeforeEach;

public class DetectionCountControllerTest {

    @Mock
    private DetectionCountService detectionCountService;

    @InjectMocks
    private DetectionCountController detectionCountController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testFindById_ReturnsEntity() {
        Long id = 1L;
        DetectionCountEntity entity = new DetectionCountEntity();
        entity.setId(id);
        when(detectionCountService.findById(id)).thenReturn(entity);

        DetectionCountEntity result = detectionCountController.findById(id);

        assertNotNull(result);
        assertEquals(id, result.getId());
        verify(detectionCountService, times(1)).findById(id);
    }

    @Test
    void testFindById_EntityNotFoundException() {
        Long id = 2L;
        when(detectionCountService.findById(id)).thenThrow(new EntityNotFoundException("Not found"));

        EntityNotFoundException thrown = assertThrows(EntityNotFoundException.class, () -> {
            detectionCountController.findById(id);
        });

        assertEquals("Not found", thrown.getMessage());
        verify(detectionCountService, times(1)).findById(id);
    }

}