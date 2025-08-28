package de.starwit.rest.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.starwit.persistence.entity.VehicleRouteEntity;
import de.starwit.service.impl.VehicleRouteService;
import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping(path = "${rest.base-path}/vehicleroute")
public class VehicleRouteController {

    private Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private VehicleRouteService vehicleRouteService;

    @Operation(summary = "Get all routes")
    @GetMapping
    public List<VehicleRouteEntity> findAll() {
        return this.vehicleRouteService.findAll();
    }

    @Operation(summary = "Get routes per vehicle")
    @GetMapping(value = "/vehicle/{name}")
    public List<VehicleRouteEntity> findAllPerVehicle(@PathVariable String name) {
        return this.vehicleRouteService.findAllByVehicle(name);
    }

}
