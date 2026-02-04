package de.starwit.rest.controller;

import java.util.List;

import org.geojson.Feature;
import org.geojson.LngLatAlt;
import org.geojson.Point;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.starwit.persistence.entity.ConfigurationEntity;
import de.starwit.service.impl.ConfigurationService;
import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("${rest.base-path}/configuration")
public class ConfigurationController {

    private static final Logger LOG = LoggerFactory.getLogger(ConfigurationController.class);

    @Autowired
    private ConfigurationService configurationService;

    private double latitude = 52.41988232741599;

    private double longitude = 10.779998775029739;

    private String city = "Wolfsburg";

    @Operation(summary = "Base coordinate to center map views")
    @GetMapping(value = "/mapcenter", produces = "application/geo+json")
    public Feature getMapCenter() {
        Feature feature = new Feature();
        Point mapCenter = new Point();

        var config = configurationService.getRepository().findAll();
        for (ConfigurationEntity ce : config) {
            if ("location_lat".equals(ce.getKeyname())) {
                latitude = Double.parseDouble(ce.getValuefield());
            }
            if ("location_long".equals(ce.getKeyname())) {
                longitude = Double.parseDouble(ce.getValuefield());
            }
            if ("city".equals(ce.getKeyname())) {
                city = ce.getValuefield();
            }
        }
        mapCenter.setCoordinates(new LngLatAlt(longitude, latitude));
        feature.setGeometry(mapCenter);
        feature.setProperty("city", city);
        return feature;
    }

    @Operation(summary = "Get all configuration entries")
    @GetMapping(value = "/")
    public List<ConfigurationEntity> getAllConfigurations() {
        return configurationService.getRepository().findAll();
    }

    @Operation(summary = "Set all configuration entries")
    @PostMapping(value = "/")
    public ResponseEntity<List<ConfigurationEntity>> setConfiguration(@RequestBody List<ConfigurationEntity> configs) {
        try {
            List<ConfigurationEntity> result = configurationService.saveOrUpdateList(configs);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            LOG.error("Error setting configuration: {}", e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Set configuration entry by key")
    @PostMapping(value = "/setbykey")
    public ResponseEntity<ConfigurationEntity> setConfigurationByKey(@RequestBody ConfigurationEntity config) {

        try {
            ConfigurationEntity result = configurationService.saveOrUpdate(config);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            LOG.error("Error setting configuration for key {}: {}", config.getKeyname(), e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

}
