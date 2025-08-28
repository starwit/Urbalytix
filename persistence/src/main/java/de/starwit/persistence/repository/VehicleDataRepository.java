package de.starwit.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import de.starwit.persistence.entity.VehicleDataEntity;

@Repository
public interface VehicleDataRepository extends JpaRepository<VehicleDataEntity, Long> {

    VehicleDataEntity findByStreamKey(String streamKey);
}
