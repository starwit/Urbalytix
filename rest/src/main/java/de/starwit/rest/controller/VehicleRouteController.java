package de.starwit.rest.controller;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.starwit.persistence.dto.MilagePerWeekDto;
import de.starwit.persistence.dto.MilagePerWeekView;
import de.starwit.persistence.entity.VehicleRouteEntity;
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

    @Operation(summary = "Get routes per vehicle per time frame")
    @GetMapping(value = "/timeframe/{streamKey}/{start}/{end}")
    public List<VehicleRouteEntity> findAllPerVehicleAndTimeframe(@PathVariable String streamKey,
            @PathVariable("start") ZonedDateTime startTime,
            @PathVariable("end") ZonedDateTime endTime) {
        return this.vehicleRouteService.findAllByVehicleAndTimeFrame(streamKey, startTime, endTime);
    }

    @Operation(summary = "Get routes per vehicle and calendar week")
    @GetMapping(value = "/calendarweek/{name}/{year}/{week}")
    public List<VehicleRouteEntity> findAllPerVehicleAndCalendarWeek(@PathVariable String name,
            @PathVariable("year") int year,
            @PathVariable("week") int week) {
        return this.vehicleRouteService.findByVehicleAndCalendarWeek(name, year, week);
    }

    @Operation(summary = "Get years/weeks with data available")
    @GetMapping(value = "/timeframes")
    public Map<Integer, List<Integer>> getAvailableTimeFrames() {
        return vehicleRouteService.getAvailableTimeFrames();
    }

    @Operation(summary = "Get route length per vehicle and calendar week")
    @GetMapping(value = "/milage/{year}/{week}")
    public List<MilagePerWeekDto> findMilagePerVehicleAndCalendarWeek(@PathVariable("year") int year,
            @PathVariable("week") int week) {
        return this.vehicleRouteService.getMilagePerWeek(year, week);
    }

    @Operation(summary = "Get route length per vehicle and calendar week")
    @GetMapping(value = "/milage-timeframe/{year}/{startweek}/{endweek}")
    public List<MilagePerWeekDto> findMilagePerVehicleForTimeFrame(@PathVariable("year") int year,
            @PathVariable("startweek") int startweek, @PathVariable("endweek") int endweek) {
        return this.vehicleRouteService.getMilagePerMultipleWeek(year, startweek, endweek);
    }

}
