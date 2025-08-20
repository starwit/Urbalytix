package de.starwit.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import de.starwit.persistence.entity.ObjectClassEntity;

@Repository
public interface ObjectClassRepository extends JpaRepository<ObjectClassEntity, Long> {

}
