package de.starwit.persistence.repository;

import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import de.starwit.persistence.entity.DetectionCountEntity;

@Repository
public interface DetectionCountRepository extends JpaRepository<DetectionCountEntity, Long> {

    @Query("SELECT DISTINCT detectionCount.className FROM DetectionCountEntity detectionCount WHERE detectionCount.detectionTime > :startTimeStamp AND detectionCount.detectionTime < :endTimeStamp")
    List<String> findDistinctClassNames(ZonedDateTime startTimeStamp, ZonedDateTime endTimeStamp);

    List<DetectionCountEntity> findByDetectionTimeBetween(ZonedDateTime startTimeStamp, ZonedDateTime endTimeStamp);

}
