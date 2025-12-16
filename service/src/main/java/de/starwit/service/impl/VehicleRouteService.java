package de.starwit.service.impl;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.IsoFields;
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
import de.starwit.persistence.entity.WeekYearAvailability;
import de.starwit.persistence.repository.VehicleDataRepository;
import de.starwit.persistence.repository.VehicleRoutesRepository;

@Service
public class VehicleRouteService implements ServiceInterface<VehicleRouteEntity, VehicleRoutesRepository> {

    private final static Logger log = LoggerFactory.getLogger(VehicleRouteService.class);

    @Autowired
    VehicleRoutesRepository repository;

    @Autowired
    VehicleDataRepository vehicleRepository;

    @Override
    public VehicleRoutesRepository getRepository() {
        return repository;
    }

    @Value("${spring.data.detection.scale:50}")
    private int scale;

    public List<VehicleRouteEntity> findAllByVehicle(String name) {
        VehicleDataEntity vehicle = vehicleRepository.findByStreamKey(name);
        if (vehicle != null) {
            return repository.findAllByVehicleData(vehicle);
        } else {
            return null;
        }
    }

    public List<VehicleRouteEntity> findAllByVehicleAndTimeFrame(String streamKey, ZonedDateTime startTime,
            ZonedDateTime endTime) {
        VehicleDataEntity vehicle = vehicleRepository.findByStreamKey(streamKey);
        if (vehicle != null) {
            return repository.findAllByVehicleDataAndUpdateTimestampBetween(vehicle.getId(), startTime, endTime, scale);
        } else {
            return null;
        }
    }

    public List<VehicleRouteEntity> findByVehicleAndCalendarWeek(String name, int year, int week) {
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

        return repository.findAllByVehicleDataAndUpdateTimestampBetween(vehicle.getId(), startZdt, endZdt, scale);
    }

    /**
     * Get all available years and weeks for which data is available
     * 
     * @return Map with year as key and list of available weeks as value
     */
    public Map<Integer, List<Integer>> getAvailableTimeFrames() {
        HashMap<Integer, List<Integer>> result = new HashMap<>();
        List<WeekYearAvailability> timeFrames = repository.findAvailableWeeksAndYears();
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
