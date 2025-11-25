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

import de.starwit.persistence.entity.CityDistrictEntity;
import de.starwit.persistence.entity.StreetCatalogEntity;
import de.starwit.service.impl.CityDistrictService;
import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping(path = "${rest.base-path}/city-district")
public class CityDistrictController {

    private static final Logger LOG = LoggerFactory.getLogger(CityDistrictController.class);

    @Autowired
    private CityDistrictService cityDistrictService;

    @Autowired
    private ObjectMapper objectMapper;

    private final GeoJsonWriter geoJsonWriter = new GeoJsonWriter();

    @Operation(summary = "Get city districts by city name")
    @GetMapping(value = "/{city}")
    public List<CityDistrictEntity> findByCity(@PathVariable("city") String city) {
        List<CityDistrictEntity> districts = this.cityDistrictService.findByCity(city);
        for (CityDistrictEntity district : districts) {
            district.setDistrictGeometry(null);
        }
        return districts;
    }

    @Operation(summary = "Get Feature collection of city districts by city name")
    @GetMapping(value = "/city/{city}", produces = "application/geo+json")
    public FeatureCollection findByCityAsFeature(@PathVariable("city") String city) {
        List<CityDistrictEntity> districts = this.cityDistrictService.findByCity(city);
        return convertToGeoJSON(districts);
    }

    private FeatureCollection convertToGeoJSON(List<CityDistrictEntity> districts) {
        FeatureCollection result = new FeatureCollection();
        for (CityDistrictEntity districtEntity : districts) {
            result.add(convertEntityToFeature(districtEntity));
        }
        return result;
    }

    private Feature convertEntityToFeature(CityDistrictEntity cityDistrictEntity) {
        Feature feature = new Feature();
        String geomJson = geoJsonWriter.write(cityDistrictEntity.getDistrictGeometry());
        GeoJsonObject geoJsonObject;
        try {
            geoJsonObject = objectMapper.readValue(geomJson, GeoJsonObject.class);
            feature.setGeometry(geoJsonObject);
        } catch (JsonProcessingException e) {
            LOG.error("Can't serialize street data");
        }

        feature.setProperty("id", cityDistrictEntity.getId());
        feature.setProperty("city", cityDistrictEntity.getCity());
        feature.setProperty("district_name", cityDistrictEntity.getName());
        feature.setProperty("district_government", cityDistrictEntity.getDistrictGovernment());
        return feature;
    }

}
