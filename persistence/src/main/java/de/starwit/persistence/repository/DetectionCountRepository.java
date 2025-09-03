package de.starwit.persistence.repository;

import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import de.starwit.persistence.entity.DetectionCountEntity;

@Repository
public interface DetectionCountRepository extends JpaRepository<DetectionCountEntity, Long> {

    @Query("SELECT DISTINCT detectionCount.className FROM DetectionCountEntity detectionCount WHERE detectionCount.detectionTime > :cutoffDate")
    List<String> findDistinctClassNames(ZonedDateTime cutoffDate);

    List<DetectionCountEntity> findByDetectionTimeBetween(ZonedDateTime startTimeStamp, ZonedDateTime endTimeStamp);

}
