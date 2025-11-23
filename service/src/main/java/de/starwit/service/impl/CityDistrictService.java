package de.starwit.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.starwit.persistence.entity.CityDistrictEntity;
import de.starwit.persistence.repository.CityDistrictRepository;

@Service
public class CityDistrictService implements ServiceInterface<CityDistrictEntity, CityDistrictRepository> {

    @Autowired
    private CityDistrictRepository repository;

    @Override
    public CityDistrictRepository getRepository() {
        return repository;
    }

    public List<CityDistrictEntity> findByCity(String city) {
        return repository.findByCity(city);
    }

}
