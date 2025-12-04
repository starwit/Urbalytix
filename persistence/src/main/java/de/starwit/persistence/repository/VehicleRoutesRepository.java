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

    @Query(value = """
            select * from vehicleroutes
            WHERE vehicle_id = :vehicleId
                AND update_ts BETWEEN :startTime AND :endTime
                AND mod(id, :scale) = 0
            """, nativeQuery = true)
    List<VehicleRouteEntity> findAllByVehicleDataAndUpdateTimestampBetween(Long vehicleId,
            ZonedDateTime startTime,
            ZonedDateTime endTime,
            int scale);

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
