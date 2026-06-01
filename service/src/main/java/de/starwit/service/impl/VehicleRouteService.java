package de.starwit.service.impl;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.time.temporal.IsoFields;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import de.starwit.persistence.entity.VehicleDataEntity;
import de.starwit.persistence.entity.VehicleRouteEntity;
import de.starwit.persistence.projection.AggregatedVehicleRouteProjection;
import de.starwit.persistence.projection.WeekYearAvailabilityProjection;
import de.starwit.persistence.repository.VehicleDataRepository;
import de.starwit.persistence.repository.VehicleRoutesRepository;
import de.starwit.service.dto.AggregatedVehicleRouteDto;
import de.starwit.service.dto.AggregatedVehicleRouteSectionDto;
import de.starwit.service.mapper.AggregatedVehicleRouteMapper;
import tools.jackson.databind.json.JsonMapper;

@Service
public class VehicleRouteService implements ServiceInterface<VehicleRouteEntity, VehicleRoutesRepository> {

    private final static Logger log = LoggerFactory.getLogger(VehicleRouteService.class);

    @Autowired
    private JsonMapper mapper;

    @Autowired
    VehicleRoutesRepository repository;

    @Autowired
    VehicleDataRepository vehicleRepository;

    @Override
    public VehicleRoutesRepository getRepository() {
        return repository;
    }

    @Value("${spring.data.vehicle-routes.aggregationIntervalMs:2000}")
    private int aggregationIntervalMs;

    @Value("${spring.data.vehicle-routes.sectionMaxGapMs:4000}")
    private int routeSectionMaxGapMs;

    private AggregatedVehicleRouteMapper vehicleRouteMapper = new AggregatedVehicleRouteMapper();

    public List<VehicleRouteEntity> findAllByVehicle(String name) {
        VehicleDataEntity vehicle = vehicleRepository.findByStreamKey(name);
        if (vehicle != null) {
            return repository.findAllByVehicleData(vehicle);
        } else {
            return null;
        }
    }

    public List<AggregatedVehicleRouteSectionDto> findAllByVehicleAndTimeFrame(String streamKey,
            ZonedDateTime startTime,
            ZonedDateTime endTime) {
        VehicleDataEntity vehicle = vehicleRepository.findByStreamKey(streamKey);
        if (vehicle != null) {
            return processAndMapAggregatedRoutes(
                    repository.findAllByVehicleDataAndUpdateTimestampBetween(vehicle.getId(), startTime, endTime,
                            aggregationIntervalMs));
        } else {
            return null;
        }
    }

    public List<AggregatedVehicleRouteSectionDto> findByVehicleAndCalendarWeek(String name, int year, int week) {
        LocalDate startOfWeek = LocalDate
                .ofYearDay(year, 1)
                .with(IsoFields.WEEK_OF_WEEK_BASED_YEAR, week)
                .with(DayOfWeek.MONDAY);

        LocalDate endOfWeek = startOfWeek.plusDays(6);

        LocalDateTime start = startOfWeek.atStartOfDay();
        LocalDateTime end = endOfWeek.atTime(LocalTime.MAX);

        ZoneId zoneId = ZoneId.of("Europe/Berlin");
        ZonedDateTime startZdt = ZonedDateTime.of(start, zoneId);
        ZonedDateTime endZdt = ZonedDateTime.of(end, zoneId);

        VehicleDataEntity vehicle = vehicleRepository.findByStreamKey(name);
        if (vehicle != null) {
            return processAndMapAggregatedRoutes(
                    repository.findAllByVehicleDataAndUpdateTimestampBetween(vehicle.getId(), startZdt, endZdt,
                            aggregationIntervalMs));
        } else {
            return null;
        }
    }

    private List<AggregatedVehicleRouteSectionDto> processAndMapAggregatedRoutes(
            List<AggregatedVehicleRouteProjection> projections) {
        List<AggregatedVehicleRouteDto> points = vehicleRouteMapper.toDtoList(projections);

        List<AggregatedVehicleRouteSectionDto> sections = splitAtGaps(points);
        for (AggregatedVehicleRouteSectionDto section : sections) {
            setPrevLocations(section.getSectionPoints());
        }

        return sections;
    }

    private List<AggregatedVehicleRouteSectionDto> splitAtGaps(List<AggregatedVehicleRouteDto> section) {
        List<AggregatedVehicleRouteSectionDto> splitSections = new ArrayList<>();

        if (section.isEmpty()) {
            return splitSections;
        }

        AggregatedVehicleRouteSectionDto currentSplit = new AggregatedVehicleRouteSectionDto();
        Instant currentTimestamp = null;
        Instant prevTimestamp = section.get(0).getTimestamp();

        for (AggregatedVehicleRouteDto point : section) {
            currentTimestamp = point.getTimestamp();

            if (prevTimestamp.plus(this.routeSectionMaxGapMs, ChronoUnit.MILLIS).isBefore(currentTimestamp)) {
                // gap between two points is larger than configured maximum -> split section
                splitSections.add(currentSplit);
                currentSplit = new AggregatedVehicleRouteSectionDto();
            }

            currentSplit.getSectionPoints().add(point);

            prevTimestamp = currentTimestamp;
        }

        if (currentSplit.getSectionPoints().size() > 0) {
            splitSections.add(currentSplit);
        }

        return splitSections;
    }

    private List<AggregatedVehicleRouteDto> setPrevLocations(List<AggregatedVehicleRouteDto> section) {
        for (int i = 1; i < section.size(); i++) {
            section.get(i).setPrevLatitude(section.get(i - 1).getLatitude());
            section.get(i).setPrevLongitude(section.get(i - 1).getLongitude());
        }
        return section;
    }

    /**
     * Get all available years and weeks for which data is available
     * 
     * @return Map with year as key and list of available weeks as value
     */
    public Map<Integer, List<Integer>> getAvailableTimeFrames() {
        HashMap<Integer, List<Integer>> result = new HashMap<>();
        List<WeekYearAvailabilityProjection> timeFrames = repository.findAvailableWeeksAndYears();
        for (var timeFrame : timeFrames) {
            if (!result.containsKey(timeFrame.year())) {
                result.put(timeFrame.year(), new LinkedList<>());
                result.get(timeFrame.year()).add(timeFrame.week());
            } else {
                if (result.get(timeFrame.year()) == null) {
                    result.put(timeFrame.year(), new LinkedList<>());
                }
                result.get(timeFrame.year()).add(timeFrame.week());
            }
        }

        return result;
    }

    public Map<ZonedDateTime, Double> getLengthByVehicleAndTimeFrame(Long vehicleId, ZonedDateTime startTime,
            ZonedDateTime endTime) {

        Map<ZonedDateTime, Double> result = new HashMap<>();
        var distances = repository.getLengthByVehicleAndTimeFrame(vehicleId, startTime, endTime);
        log.info("Distance: {}", distances);
        if (distances.isEmpty()) {
            return Map.of();
        }
        for (Object[] row : distances) {
            Instant instant = (java.time.Instant) row[0];
            ZonedDateTime zdt = instant.atZone(ZoneId.of("Europe/Berlin"));
            Double length = ((Number) row[1]).doubleValue();
            result.put(zdt, length);
        }
        return result;
    }
}
