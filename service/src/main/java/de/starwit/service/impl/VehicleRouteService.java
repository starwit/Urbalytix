package de.starwit.service.impl;

import java.time.DayOfWeek;
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
import org.springframework.stereotype.Service;

import de.starwit.persistence.entity.VehicleDataEntity;
import de.starwit.persistence.entity.VehicleRouteEntity;
import de.starwit.persistence.entity.WeekYearAvailability;
import de.starwit.persistence.repository.VehicleDataRepository;
import de.starwit.persistence.repository.VehicleRoutesRepository;

@Service
public class VehicleRouteService implements ServiceInterface<VehicleRouteEntity, VehicleRoutesRepository> {

    private Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    VehicleRoutesRepository repository;

    @Autowired
    VehicleDataRepository vehicleRepository;

    @Override
    public VehicleRoutesRepository getRepository() {
        return repository;
    }

    public List<VehicleRouteEntity> findAllByVehicle(String name) {
        VehicleDataEntity vehicle = vehicleRepository.findByStreamKey(name);
        if (vehicle != null) {
            return repository.findAllByVehicleData(vehicle);
        } else {
            return null;
        }
    }

    public List<VehicleRouteEntity> findAllByVehicleAndTimeFrame(String name, ZonedDateTime startTime,
            ZonedDateTime endTime) {
        VehicleDataEntity vehicle = vehicleRepository.findByStreamKey(name);
        if (vehicle != null) {
            return repository.findAllByVehicleDataAndUpdateTimestampBetween(vehicle, startTime, endTime);
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

        return repository.findAllByVehicleDataAndUpdateTimestampBetween(vehicle, startZdt, endZdt);
    }

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

}
