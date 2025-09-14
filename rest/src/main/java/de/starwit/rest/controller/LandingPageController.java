package de.starwit.rest.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "${rest.base-path}/landing-page")
public class LandingPageController {

    @Value("${landing.wastemanagement.endpoint}")
    private String wasteManagementUrl;

    @Value("${landing.parking.endpoint}")
    private String parkingUrl;

    @Value("${landing.trafficlive.endpoint}")
    private String trafficLiveUrl;

    @Value("${landing.trafficanalysis.endpoint}")
    private String trafficAnalysisUrl;

    @Value("${landing.assetmanagement.endpoint}")
    private String assetManagementUrl;

    @Value("${landing.publicsafety.endpoint}")
    private String publicSafetyUrl;

    @GetMapping
    public Map<String, String> getEndpoints() {
        return Map.of(
                "wastemanagement", wasteManagementUrl,
                "parking", parkingUrl,
                "trafficlife", trafficLiveUrl,
                "trafficanalysis", trafficAnalysisUrl,
                "assetmanagement", assetManagementUrl,
                "publicsafety", publicSafetyUrl);
    }

}
