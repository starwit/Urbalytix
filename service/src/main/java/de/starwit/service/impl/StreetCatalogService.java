package de.starwit.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.starwit.persistence.dto.StreetWithDistrictDto;
import de.starwit.persistence.entity.StreetCatalogEntity;
import de.starwit.persistence.repository.StreetCatalogRepository;

@Service
public class StreetCatalogService implements ServiceInterface<StreetCatalogEntity, StreetCatalogRepository> {

    @Autowired
    private StreetCatalogRepository repository;

    @Override
    public StreetCatalogRepository getRepository() {
        return repository;
    }

    public List<StreetCatalogEntity> findByCity(String city) {
        return repository.findByCity(city);
    }

    public List<StreetWithDistrictDto> findByCityWithDistrict(String city) {
        List<StreetWithDistrictDto> list = repository.findStreetsByCityWithDistrict(city);
        return list;
    }

}
