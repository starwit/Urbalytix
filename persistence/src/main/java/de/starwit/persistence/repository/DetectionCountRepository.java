package de.starwit.persistence.repository;

import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import de.starwit.persistence.entity.DetectionCountEntity;

@Repository
public interface DetectionCountRepository extends JpaRepository<DetectionCountEntity, Long> {

    @Query("SELECT DISTINCT d.classId FROM DetectionCountEntity d WHERE d.classId IS NOT NULL")
    List<Long> findDistinctClassIds();

    List<DetectionCountEntity> findByDetectionTimeBetween(ZonedDateTime startTimeStamp, ZonedDateTime endTimeStamp);

}
