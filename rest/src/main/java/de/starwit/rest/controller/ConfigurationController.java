package de.starwit.rest.controller;

import java.util.List;

import org.geojson.Feature;
import org.geojson.LngLatAlt;
import org.geojson.Point;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

    @Value("${config.mapcenter.lat}")
    private double latitude;

    @Value("${config.mapcenter.long}")
    private double longitude;

    @Value("${config.mapcenter.city}")
    private String city;

    @Operation(summary = "Base coordinate to center map views")
    @GetMapping(value = "/mapcenter", produces = "application/geo+json")
    public Feature getMapCenter() {
        Feature feature = new Feature();
        Point mapCenter = new Point();
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

    @Operation(summary = "Set configuration entry by key")
    @PostMapping(value = "/")
    public List<ConfigurationEntity> setConfiguration(@RequestBody List<ConfigurationEntity> configs) {
        return configurationService.saveOrUpdateList(configs);
    }

    @Operation(summary = "Set configuration entry by key")
    @PostMapping(value = "/setbykey")
    public ConfigurationEntity setConfigurationByKey(@RequestBody ConfigurationEntity config) {
        LOG.info(config.toString());
        return configurationService.saveOrUpdate(config);
    }

}
