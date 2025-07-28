package de.starwit.service.impl;

import org.geojson.FeatureCollection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * This service is supposed to collect various data from community
 * infrastructure e.g. location of trash bins.
 */

@Service
public class InfrastructureCollectionService {

    private Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ObjectMapper mapper;

    @Value("${infra.trash.endpoint}")
    private String infraTrashEndpoint;

    @Value("${infra.trash.secret}")
    private String infraTrashEndpointSecret;

    public FeatureCollection collectGeoFeatures() {
        log.info("Starting to collect data from " + infraTrashEndpoint);
        var url = infraTrashEndpoint + "?api_key=" + infraTrashEndpointSecret;

        var response = restTemplate.getForEntity(url, String.class);
        FeatureCollection fc = parseGeoFeatures(response.getBody());
        log.info(fc.getFeatures().size() + " trash bins found");
        return fc;
    }

    public FeatureCollection parseGeoFeatures(String json) {
        FeatureCollection fc = new FeatureCollection();
        log.debug("Parsing trash bin data: " + json);
        try {
            fc = mapper.readValue(json, FeatureCollection.class);
        } catch (JsonProcessingException e) {
            log.error("Parsing trash bin data failed " + e.getMessage());
        }
        return fc;
    }
}
