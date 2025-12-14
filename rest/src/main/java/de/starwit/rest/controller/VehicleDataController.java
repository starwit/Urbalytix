package de.starwit.rest.controller;

import java.time.ZonedDateTime;
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

import de.starwit.persistence.entity.VehicleDataEntity;
import de.starwit.persistence.exception.NotificationException;
import de.starwit.rest.exception.NotificationDto;
import de.starwit.service.dto.VehicleStatisticsDTO;
import de.starwit.service.impl.VehicleDataService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;

@RestController
@RequestMapping(path = "${rest.base-path}/vehicle")
public class VehicleDataController {

    private Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private VehicleDataService vehicleDataService;

    @Operation(summary = "Get all vehicles")
    @GetMapping
    public List<VehicleDataEntity> findAll() {
        return this.vehicleDataService.findAll();
    }

    @Operation(summary = "Get all vehicles with statistics")
    @GetMapping("/statistics/{start}/{end}")
    public List<VehicleStatisticsDTO> findAllWithStatistics(@PathVariable("start") ZonedDateTime startTime,
            @PathVariable("end") ZonedDateTime endTime) {
        return this.vehicleDataService.findAllWithDistances(startTime, endTime);
    }

    @Operation(summary = "Get action with id")
    @GetMapping(value = "/{id}")
    public VehicleDataEntity findById(@PathVariable("id") Long id) {
        return this.vehicleDataService.findById(id);
    }

    @Operation(summary = "Create action")
    @PostMapping
    public VehicleDataEntity save(@Valid @RequestBody VehicleDataEntity entity) {
        return update(entity);
    }

    @Operation(summary = "Update action")
    @PutMapping
    public VehicleDataEntity update(@Valid @RequestBody VehicleDataEntity entity) {
        return vehicleDataService.saveOrUpdate(entity);
    }

    @Operation(summary = "Delete action")
    @DeleteMapping(value = "/{id}")
    public void delete(@PathVariable("id") Long id) throws NotificationException {
        vehicleDataService.delete(id);
    }

    @ExceptionHandler(value = { EntityNotFoundException.class })
    public ResponseEntity<Object> handleException(EntityNotFoundException ex) {
        log.info("Action not found. {}", ex.getMessage());
        NotificationDto output = new NotificationDto("error.action.notfound", "Action not found.");
        return new ResponseEntity<>(output, HttpStatus.NOT_FOUND);
    }

}
