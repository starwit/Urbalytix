package de.starwit.persistence.repository;

import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import de.starwit.persistence.entity.VehicleDataEntity;
import de.starwit.persistence.entity.VehicleRouteEntity;

@Repository
public interface VehicleRoutesRepository extends JpaRepository<VehicleRouteEntity, Long> {

    List<VehicleRouteEntity> findAllByVehicleData(VehicleDataEntity vehicle);

    // @Query("SELECT r FROM VehicleRouteEntity r WHERE r.updateTimestamp >
    // startTime AND r.updateTimestamp < endTime")
    List<VehicleRouteEntity> findAllByVehicleDataAndUpdateTimestampBetween(VehicleDataEntity vehicle,
            ZonedDateTime startTime,
            ZonedDateTime endTime);

}
