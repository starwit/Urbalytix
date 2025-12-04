package de.starwit.rest.controller;

import java.util.List;

import org.geojson.Feature;
import org.geojson.FeatureCollection;
import org.geojson.GeoJsonObject;
import org.locationtech.jts.io.geojson.GeoJsonWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import de.starwit.persistence.dto.StreetWithDistrictDto;
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

    @Operation(summary = "Get street with id")
    @GetMapping(value = "/{id}", produces = "application/geo+json")
    public Feature findById(@PathVariable("id") Long id) {
        StreetCatalogEntity streetCatalogEntity = this.streetCatalogService.findById(id);
        Feature feature = convertEntityToFeature(streetCatalogEntity);
        return feature;
    }

    @Operation(summary = "Get street geometries for given city")
    @GetMapping(value = "/geometrybycity/{city}", produces = "application/geo+json")
    public FeatureCollection findAllByCity(@PathVariable("city") String city) {
        List<StreetCatalogEntity> streets = this.streetCatalogService.findByCity(city);
        return convertToGeoJSON(streets);
    }

    @Operation(summary = "Get street for given city, add city district")
    @GetMapping(value = "/list/{city}", produces = "application/geo+json")
    public List<StreetWithDistrictDto> findAllByCityWithDistrict(@PathVariable("city") String city) {
        List<StreetWithDistrictDto> streets = this.streetCatalogService.findByCityWithDistrict(city);
        return streets;
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
