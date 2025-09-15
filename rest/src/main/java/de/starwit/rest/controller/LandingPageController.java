package de.starwit.rest.controller;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Component
@ConfigurationProperties(prefix = "landing")
class LandingProperties {
    private Map<String, EndPointData> endpoints;

    public Map<String, EndPointData> getEndpoints() {
        return endpoints;
    }

    public void setEndpoints(Map<String, EndPointData> endpoints) {
        this.endpoints = endpoints;
    }
}

class EndPointData {
    private String name;
    private String endpoint;
    private String image;
    private int order;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public int getOrder() {
        return order;
    }

    public void setOrder(int order) {
        this.order = order;
    }
}

@RestController
@RequestMapping(path = "${rest.base-path}/landing-page")
public class LandingPageController {

    private static final Logger log = LoggerFactory.getLogger(LandingPageController.class);

    private final LandingProperties landingProperties;

    public LandingPageController(LandingProperties landingProperties) {
        this.landingProperties = landingProperties;
    }

    @GetMapping
    public Map<String, EndPointData> getEndpoints() {
        log.info(landingProperties.getEndpoints().toString());
        return landingProperties.getEndpoints();
    }

}
