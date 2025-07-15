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

import de.starwit.persistence.entity.DecisionEntity;
import de.starwit.persistence.exception.NotificationException;
import de.starwit.rest.exception.NotificationDto;
import de.starwit.service.impl.DecisionService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;

/**
 * Decision RestController
 * Have a look at the RequestMapping!!!!!!
 */
@RestController
@RequestMapping(path = "${rest.base-path}/decision")
public class DecisionController {

    static final Logger LOG = LoggerFactory.getLogger(DecisionController.class);

    @Autowired
    private DecisionService decisionService;

    @Operation(summary = "Get all decision")
    @GetMapping
    public List<DecisionEntity> findAll() {
        return this.decisionService.findAll();
    }

    @Operation(summary = "Get decision with id")
    @GetMapping(value = "/{id}")
    public DecisionEntity findById(@PathVariable("id") Long id) {
        return this.decisionService.findById(id);
    }

    @Operation(summary = "Create decision")
    @PostMapping
    public DecisionEntity save(@Valid @RequestBody DecisionEntity entity) {
        return this.update(entity);
    }

    @Operation(summary = "Update decision")
    @PutMapping
    public DecisionEntity update(@Valid @RequestBody DecisionEntity entity) {
        LOG.info("Updating decision with id: {}", entity.getId());
        return decisionService.saveOrUpdate(entity);
    }

    @Operation(summary = "Delete decision")
    @DeleteMapping(value = "/{id}")
    public void delete(@PathVariable("id") Long id) throws NotificationException {
        decisionService.delete(id);
    }

    @ExceptionHandler(value = { EntityNotFoundException.class })
    public ResponseEntity<Object> handleException(EntityNotFoundException ex) {
        LOG.info("Decision not found. {}", ex.getMessage());
        NotificationDto output = new NotificationDto("error.decision.notfound", "Decision not found.");
        return new ResponseEntity<>(output, HttpStatus.NOT_FOUND);
    }
}
