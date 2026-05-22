package de.starwit.rest.controller;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;

import org.geojson.FeatureCollection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.starwit.persistence.entity.VehicleRouteEntity;
import de.starwit.persistence.projection.AggregatedVehicleRouteProjection;
import de.starwit.service.dto.AggregatedVehicleRouteSectionDto;
import de.starwit.service.impl.VehicleRouteService;
import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping(path = "${rest.base-path}/vehicleroute")
public class VehicleRouteController {

    private final static Logger log = LoggerFactory.getLogger(VehicleRouteController.class);

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

    @Operation(summary = "Get aggregatedroutes per vehicle per time frame")
    @GetMapping(value = "/timeframe/aggregated/{streamKey}/{start}/{end}")
    public List<AggregatedVehicleRouteSectionDto> findAllPerVehicleAndTimeframe(@PathVariable String streamKey,
            @PathVariable("start") ZonedDateTime startTime,
            @PathVariable("end") ZonedDateTime endTime) {
        return this.vehicleRouteService.findAllByVehicleAndTimeFrame(streamKey, startTime, endTime);
    }

    @Operation(summary = "Get aggregated routes per vehicle and calendar week")
    @GetMapping(value = "/calendarweek/aggregated/{name}/{year}/{week}")
    public List<AggregatedVehicleRouteSectionDto> findAllPerVehicleAndCalendarWeek(@PathVariable String name,
            @PathVariable("year") int year,
            @PathVariable("week") int week) {
        return this.vehicleRouteService.findByVehicleAndCalendarWeek(name, year, week);
    }

    @Operation(summary = "Get years/weeks with data available")
    @GetMapping(value = "/timeframes")
    public Map<Integer, List<Integer>> getAvailableTimeFrames() {
        return vehicleRouteService.getAvailableTimeFrames();
    }

    @Operation(summary = "Get route length per vehicle and time frame")
    @GetMapping(value = "/length/{vehicleId}/{start}/{end}")
    public Map<ZonedDateTime, Double> getLengthByVehicleAndTimeFrame(@PathVariable Long vehicleId,
            @PathVariable("start") ZonedDateTime startTime,
            @PathVariable("end") ZonedDateTime endTime) {
        return vehicleRouteService.getLengthByVehicleAndTimeFrame(vehicleId, startTime, endTime);
    }

}
