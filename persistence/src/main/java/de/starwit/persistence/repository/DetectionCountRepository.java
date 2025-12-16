package de.starwit.persistence.repository;

import java.time.ZonedDateTime;
import java.util.List;

import org.locationtech.jts.geom.Geometry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import de.starwit.persistence.dto.DistrictWithDetectionCountDto;
import de.starwit.persistence.entity.DetectionCountEntity;

@Repository
public interface DetectionCountRepository extends JpaRepository<DetectionCountEntity, Long> {

    @Query("SELECT DISTINCT detectionCount.className FROM DetectionCountEntity detectionCount WHERE detectionCount.detectionTime > :startTimeStamp AND detectionCount.detectionTime < :endTimeStamp")
    List<String> findDistinctClassNames(ZonedDateTime startTimeStamp, ZonedDateTime endTimeStamp);

    List<DetectionCountEntity> findByDetectionTimeBetween(ZonedDateTime startTimeStamp, ZonedDateTime endTimeStamp);

    @Query(value = "SELECT * FROM detection_count WHERE st_contains(?1, location) LIMIT 100", nativeQuery = true)
    List<DetectionCountEntity> findByStreet(Geometry street);

    // get latest entry
    DetectionCountEntity findTopByOrderByDetectionTimeDesc();

    @Query(value = """
                SELECT
                    new de.starwit.persistence.dto.DistrictWithDetectionCountDto(
                        d.id,
                        d.name,
                        dc.className,
                        SUM(dc.count)
                    )
                FROM CityDistrictEntity d
                JOIN DetectionCountEntity dc
                    ON ST_Within(dc.location, d.districtGeometry)
                WHERE dc.detectionTime >= :startTimeStamp
                AND dc.detectionTime < :endTimeStamp
                GROUP BY d.id, d.name, dc.className
                ORDER BY d.name, dc.className
            """)
    List<DistrictWithDetectionCountDto> findByDistrictInTimeframeByWasteType(ZonedDateTime startTimeStamp,
            ZonedDateTime endTimeStamp);

    @Query(value = """
                SELECT
                    new de.starwit.persistence.dto.DistrictWithDetectionCountDto(
                        d.id,
                        d.name,
                        'waste',
                        SUM(dc.count)
                    )
                FROM CityDistrictEntity d
                JOIN DetectionCountEntity dc
                    ON ST_Within(dc.location, d.districtGeometry)
                WHERE dc.detectionTime >= :startTimeStamp
                AND dc.detectionTime < :endTimeStamp
                GROUP BY d.id, d.name
                ORDER BY d.name
            """)
    List<DistrictWithDetectionCountDto> findByDistrictInTimeframe(ZonedDateTime startTimeStamp,
            ZonedDateTime endTimeStamp);

    @Query(value = """
            SELECT
                sc.id AS street_id,
                sc.street_name,
                MAX(dc.detection_time) AS last_detection_time
            FROM street_catalog sc
            LEFT JOIN detection_count dc
                ON dc.detection_time > :since
                AND sc.city = :city
                AND ST_DWithin(sc.street_path, dc.location, 0.000015)
            GROUP BY
                sc.id, sc.city, sc.street_name
            ORDER BY
                street_id, sc.city, sc.street_name
            """, nativeQuery = true)
    List<Object[]> findLastDetectionDatePerStreet(ZonedDateTime since, String city);

}
