package de.starwit.rest.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.starwit.persistence.entity.DetectionCountEntity;
import de.starwit.persistence.exception.NotificationException;
import de.starwit.rest.exception.NotificationDto;
import de.starwit.service.impl.DetectionCountService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;

@RestController
@RequestMapping(path = "${rest.base-path}/detection-count")
public class DetectionCountController {

    static final Logger LOG = LoggerFactory.getLogger(DetectionCountController.class);

    @Autowired
    private DetectionCountService decisionService;

    @Operation(summary = "Get all detection count")
    @GetMapping
    public List<DetectionCountEntity> findAll() {
        return this.decisionService.findAll();
    }

    @Operation(summary = "Get detection count with id")
    @GetMapping(value = "/{id}")
    public DetectionCountEntity findById(@PathVariable("id") Long id) {
        return this.decisionService.findById(id);
    }

    @Operation(summary = "Create detection count")
    @PostMapping
    public DetectionCountEntity save(@Valid @RequestBody DetectionCountEntity entity) {
        return this.update(entity);
    }

    @Operation(summary = "Update detection count")
    @PutMapping
    public DetectionCountEntity update(@Valid @RequestBody DetectionCountEntity entity) {
        LOG.info("Updating detection count with id: {}", entity.getId());
        return decisionService.saveOrUpdate(entity);
    }

    @Operation(summary = "Delete detection count")
    @DeleteMapping(value = "/{id}")
    public void delete(@PathVariable("id") Long id) throws NotificationException {
        decisionService.delete(id);
    }

    @ExceptionHandler(value = { EntityNotFoundException.class })
    public ResponseEntity<Object> handleException(EntityNotFoundException ex) {
        LOG.info("Detection count not found. {}", ex.getMessage());
        NotificationDto output = new NotificationDto("error.detection.count.notfound", "Detection count not found.");
        return new ResponseEntity<>(output, HttpStatus.NOT_FOUND);
    }
}
