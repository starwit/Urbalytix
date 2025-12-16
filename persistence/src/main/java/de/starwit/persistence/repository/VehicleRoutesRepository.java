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

    @Query(value = """
            SELECT effective_day,ST_Length(geography(ST_MakeLine(location ORDER BY update_ts))) AS meters
            FROM (
            	SELECT vehicle_id,
            			time_bucket('1 day', update_ts) AS effective_day,
            			update_ts,
            			location
            	FROM vehicleroutes
            	WHERE
            		vehicle_id = :vehicleId
            		AND update_ts BETWEEN :startTime AND :endTime
            	) t
            GROUP BY effective_day
            ORDER BY effective_day
                        """, nativeQuery = true)
    List<Object[]> getLengthByVehicleAndTimeFrame(Long vehicleId, ZonedDateTime startTime,
            ZonedDateTime endTime);

    @Query(value = """
            SELECT vehicle_id, effective_day,ST_Length(geography(ST_MakeLine(location ORDER BY update_ts))) AS meters
            FROM (
            	SELECT vehicle_id,
            			time_bucket('1 day', update_ts) AS effective_day,
            			update_ts,
            			location
            	FROM vehicleroutes
            	WHERE
            		update_ts BETWEEN :startTime AND :endTime
            	) t
            GROUP BY vehicle_id, effective_day
            ORDER BY vehicle_id, effective_day
                        """, nativeQuery = true)
    List<Object[]> getLengthForAllVehiclesAndTimeFrame(ZonedDateTime startTime,
            ZonedDateTime endTime);

    @Query(value = """
            WITH ordered AS (
                SELECT
                    vehicle_id,
                    update_ts,
                    location,
                    LAG(location) OVER (
                        PARTITION BY vehicle_id
                        ORDER BY update_ts
                    ) AS prev_location,
                    LAG(update_ts) OVER (
                        PARTITION BY vehicle_id
                        ORDER BY update_ts
                    ) AS prev_ts
                FROM public.vehicleroutes
                WHERE update_ts >= :startTime
                  AND update_ts <  :endTime
                  AND vehicle_id = :vehicleId
            ),
            dist AS (
                SELECT
                    vehicle_id,
                    update_ts,
                    location,
                    prev_location,
                    prev_ts,
                    ST_Distance(location::geography, prev_location::geography) AS distance_m,
                    EXTRACT(EPOCH FROM (update_ts - prev_ts)) AS delta_t_s
                FROM ordered
                WHERE prev_location IS NOT NULL     -- exclude first point
            )
            SELECT
                vehicle_id,
                update_ts,
                distance_m,
                delta_t_s,
                distance_m / delta_t_s AS velocity_m_s
            FROM dist
            WHERE distance_m > 0                   -- exclude zero-distance pairs
              AND delta_t_s > 0                    -- avoid division by zero
            ORDER BY vehicle_id, update_ts;
                        """, nativeQuery = true)
    List<Object[]> getSpeedByVehicleAndTimeFrame(ZonedDateTime startTime,
            ZonedDateTime endTime);

}
