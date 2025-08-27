package de.starwit.rest.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.starwit.service.impl.StreamSubscriptionService;
import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("${rest.base-path}/configuration")
public class ConfigurationController {

    @Autowired
    StreamSubscriptionService detectionService;

    @Operation(summary = "Get all stream subscriptions")

    @GetMapping
    public Map<String, List<String>> findAll() {
        return this.detectionService.getKeysPerStream();
    }

}
