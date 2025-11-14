package de.starwit.rest.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.geojson.Feature;
import org.geojson.FeatureCollection;
import org.geojson.GeoJsonObject;
import org.locationtech.jts.io.geojson.GeoJsonWriter;

import de.starwit.persistence.entity.StreetCatalogEntity;
import de.starwit.service.impl.StreetCatalogService;
import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping(path = "${rest.base-path}/street-catalog")
public class StreetCatalogController {

    private static final Logger LOG = LoggerFactory.getLogger(StreetCatalogController.class);

    @Autowired
    private StreetCatalogService streetCatalogService;

    @Autowired
    private ObjectMapper objectMapper;

    private final GeoJsonWriter geoJsonWriter = new GeoJsonWriter();

    @Operation(summary = "Get all available streets")
    @GetMapping
    public ResponseEntity<FeatureCollection> findAll() {
        var streets = this.streetCatalogService.findAll();
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/geo+json"))
                .body(convertToGeoJSON(streets));
    }

    @Operation(summary = "Get street with id")
    @GetMapping(value = "/{id}", produces = "application/geo+json")
    public ResponseEntity<Feature> findById(@PathVariable("id") Long id) {
        StreetCatalogEntity streetCatalogEntity = this.streetCatalogService.findById(id);
        Feature feature = convertEntityToFeature(streetCatalogEntity);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/geo+json"))
                .body(feature);
    }

    @Operation(summary = "Get street with id")
    @GetMapping(value = "/city/{city}", produces = "application/geo+json")
    public ResponseEntity<FeatureCollection> findByCity(@PathVariable("city") String city) {
        var streets = this.streetCatalogService.findByCity(city);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/geo+json"))
                .body(convertToGeoJSON(streets));
    }

    private FeatureCollection convertToGeoJSON(List<StreetCatalogEntity> streets) {
        FeatureCollection result = new FeatureCollection();
        for (StreetCatalogEntity streetCatalogEntity : streets) {
            result.add(convertEntityToFeature(streetCatalogEntity));
        }
        return result;
    }

    private Feature convertEntityToFeature(StreetCatalogEntity streetCatalogEntity) {
        Feature feature = new Feature();
        String geomJson = geoJsonWriter.write(streetCatalogEntity.getStreetPath());
        GeoJsonObject geoJsonObject;
        try {
            geoJsonObject = objectMapper.readValue(geomJson, GeoJsonObject.class);
            feature.setGeometry(geoJsonObject);
        } catch (JsonProcessingException e) {
            LOG.error("Can't serialize street data");
        }

        feature.setProperty("id", streetCatalogEntity.getId());
        feature.setProperty("city", streetCatalogEntity.getCity());
        feature.setProperty("street_name", streetCatalogEntity.getStreetName());
        return feature;
    }

}
