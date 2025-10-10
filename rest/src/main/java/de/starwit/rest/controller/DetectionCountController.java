package de.starwit.rest.controller;

import java.time.ZonedDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import de.starwit.persistence.entity.DetectionCountEntity;
import de.starwit.persistence.serializer.ZonedDateTimeDeserializer;
import de.starwit.rest.exception.NotificationDto;
import de.starwit.service.impl.DetectionCountService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping(path = "${rest.base-path}/detection-count")
public class DetectionCountController {

    private static final Logger LOG = LoggerFactory.getLogger(DetectionCountController.class);

    @Autowired
    private DetectionCountService detectionCountService;

    @Operation(summary = "Get all detection count")
    @GetMapping
    public List<DetectionCountEntity> findAll() {
        return this.detectionCountService.findAll();
    }

    @Operation(summary = "Get detection count from start/end")

    @JsonDeserialize(using = ZonedDateTimeDeserializer.class)
    @GetMapping(value = "/timeframe/{start}/{end}")
    public List<DetectionCountEntity> findAllFromTimeFrame(@PathVariable("start") ZonedDateTime startTime,
            @PathVariable("end") ZonedDateTime endTime) {
        List<DetectionCountEntity> entities = this.detectionCountService.getDataFromTimeFrame(startTime, endTime);
        return entities;
    }

    @Operation(summary = "Find latest data")
    @GetMapping(value = "/limited/{amount}")
    public List<DetectionCountEntity> findAllLimited(@PathVariable("amount") int amount) {
        return this.detectionCountService.findAllLimited(amount);
    }

    @Operation(summary = "Get detection count with id")
    @GetMapping(value = "/{id}")
    public DetectionCountEntity findById(@PathVariable("id") Long id) {
        return this.detectionCountService.findById(id);
    }

    @Operation(summary = "Get all detected object classes")
    @GetMapping(value = "/classes/{start}/{end}")
    public List<String> getAllDetectedObjectClasses(@PathVariable("start") ZonedDateTime startTime,
            @PathVariable("end") ZonedDateTime endTime) {
        return this.detectionCountService.getAllDetectedObjectClasses(startTime, endTime);
    }

    @ExceptionHandler(value = { EntityNotFoundException.class })
    public ResponseEntity<Object> handleException(EntityNotFoundException ex) {
        LOG.info("Detection count not found. {}", ex.getMessage());
        NotificationDto output = new NotificationDto("error.detection.count.notfound", "Detection count not found.");
        return new ResponseEntity<>(output, HttpStatus.NOT_FOUND);
    }
}
