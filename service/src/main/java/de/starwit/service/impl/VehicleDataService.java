package de.starwit.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.starwit.persistence.entity.VehicleDataEntity;
import de.starwit.persistence.repository.VehicleDataRepository;

@Service
public class VehicleDataService implements ServiceInterface<VehicleDataEntity, VehicleDataRepository> {

    @Autowired
    private VehicleDataRepository repository;

    @Override
    public VehicleDataRepository getRepository() {
        return repository;
    }
}
