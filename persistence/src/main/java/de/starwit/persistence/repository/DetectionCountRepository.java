package de.starwit.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import de.starwit.persistence.entity.DetectionCountEntity;

@Repository
public interface DetectionCountRepository extends JpaRepository<DetectionCountEntity, Long> {

}
