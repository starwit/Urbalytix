package de.starwit.persistence.repository;

import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import de.starwit.persistence.entity.VehicleDataEntity;
import de.starwit.persistence.entity.VehicleRouteEntity;
import de.starwit.persistence.entity.WeekYearAvailability;

@Repository
public interface VehicleRoutesRepository extends JpaRepository<VehicleRouteEntity, Long> {

    List<VehicleRouteEntity> findAllByVehicleData(VehicleDataEntity vehicle);

    List<VehicleRouteEntity> findAllByVehicleDataAndUpdateTimestampBetween(VehicleDataEntity vehicle,
            ZonedDateTime startTime,
            ZonedDateTime endTime);

    @Query(value = """
            SELECT
                EXTRACT(week FROM update_ts)::int AS week,
                EXTRACT(isoyear FROM update_ts)::int AS year
            FROM vehicleroutes
            WHERE update_ts IS NOT NULL
            GROUP BY year, week
            ORDER BY year, week
            """, nativeQuery = true)
    List<WeekYearAvailability> findAvailableWeeksAndYears();
}
