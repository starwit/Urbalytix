package de.starwit.rest.controller;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;

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

import de.starwit.persistence.dto.StreetWithDistrictDto;
import de.starwit.persistence.entity.StreetCatalogEntity;
import de.starwit.service.impl.DetectionCountService;
import de.starwit.service.impl.StreetCatalogService;
import io.swagger.v3.oas.annotations.Operation;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.json.JsonMapper;

@RestController
@RequestMapping(path = "${rest.base-path}/street-catalog")
public class StreetCatalogController {

    private static final Logger LOG = LoggerFactory.getLogger(StreetCatalogController.class);

    @Autowired
    private StreetCatalogService streetCatalogService;

    @Autowired
    private DetectionCountService detectionCountService;

    @Autowired
    private JsonMapper mapper;

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

    @Operation(summary = "Get street for given city and city district")
    @GetMapping(value = "/list/district/{city}/{district}", produces = "application/geo+json")
    public FeatureCollection findAllByCityAndDistrict(@PathVariable("city") String city,
            @PathVariable("district") String district) {
        List<StreetCatalogEntity> streets = this.streetCatalogService.findByCityDistrict(city, district);
        return convertToGeoJSON(streets);
    }

    @Operation(summary = "Get street list with last cleaning date")
    @GetMapping(value = "/cleaning/{city}", produces = "application/json")
    public List<StreetWithDistrictDto> findAllStreetsWithLastDetectionDate(@PathVariable("city") String city) {
        List<StreetWithDistrictDto> streetsWithDistricts = this.streetCatalogService.findByCityWithDistrict(city);
        Map<Long, ZonedDateTime> lastDetectionForStreet = this.detectionCountService
                .findLastDetectionDatePerStreet(city);

        for (StreetWithDistrictDto street : streetsWithDistricts) {
            if (lastDetectionForStreet.containsKey(street.getId())) {
                street.setLastCleaning(lastDetectionForStreet.get(street.getId()));
            }
        }

        return streetsWithDistricts;
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
            geoJsonObject = mapper.readValue(geomJson, GeoJsonObject.class);
            feature.setGeometry(geoJsonObject);
        } catch (JacksonException e) {
            LOG.error("Can't serialize street data");
        }

        feature.setProperty("id", streetCatalogEntity.getId());
        feature.setProperty("city", streetCatalogEntity.getCity());
        feature.setProperty("street_name", streetCatalogEntity.getStreetName());
        return feature;
    }

}
