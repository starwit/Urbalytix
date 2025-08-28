package de.starwit.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.starwit.persistence.entity.VehicleDataEntity;
import de.starwit.persistence.entity.VehicleRouteEntity;
import de.starwit.persistence.repository.VehicleDataRepository;
import de.starwit.persistence.repository.VehicleRoutesRepository;

@Service
public class VehicleRouteService implements ServiceInterface<VehicleRouteEntity, VehicleRoutesRepository> {

    @Autowired
    VehicleRoutesRepository repository;

    @Autowired
    VehicleDataRepository vehicleRepository;

    @Override
    public VehicleRoutesRepository getRepository() {
        return repository;
    }

    public List<VehicleRouteEntity> findAllByVehicle(String name) {
        VehicleDataEntity vehicle = vehicleRepository.findByStreamKey(name);
        if (vehicle != null) {
            return repository.findAllByVehicleData(vehicle);
        } else {
            return null;
        }
    }

}
