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

    /*
     * @Query(value = """
     * select * from (
     * SELECT *, row_number() over (order by update_ts asc) as rw_number
     * FROM vehicleroutes
     * WHERE vehicle_id = :vehicleId
     * AND update_ts BETWEEN :startTime AND :endTime
     * ) sub
     * WHERE mod(rw_number, :scale) = 0
     * ORDER BY update_ts ASC
     * """, nativeQuery = true)
     */
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

    @Query(value = """
            SELECT
                vehicle_id,
                effective_day,
                ST_Length(geography(ST_MakeLine(location ORDER BY update_ts))) AS meters,
                ST_Length(geography(ST_MakeLine(location ORDER BY update_ts)))/1000.0 AS km,
                COUNT(*) AS points
            FROM (
                SELECT vehicle_id,
                        time_bucket('1 day', update_ts) AS effective_day,
                        update_ts,
                        location
                FROM public.vehicleroutes
                    WHERE EXTRACT(ISOYEAR FROM update_ts) = :year
                    AND EXTRACT(WEEK FROM update_ts) = :week
                ) t
            GROUP BY vehicle_id, effective_day
            ORDER BY vehicle_id, effective_day;
                    """, nativeQuery = true)
    void getRoutesLengthPerDayinWeekYear(int week, int year);
}
