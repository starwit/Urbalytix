package de.starwit.rest.controller;

import org.geojson.FeatureCollection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.starwit.service.impl.InfrastructureCollectionService;
import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping(path = "${rest.base-path}/feature-collector")
public class FeatureCollectionController {

    private Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    InfrastructureCollectionService collectionService;

    @Operation(summary = "Get infrastructure data")
    @GetMapping
    public FeatureCollection getAllFeatures() {
        return this.collectionService.collectGeoFeatures();
    }

}
