package de.starwit.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.starwit.persistence.dto.StreetWithDistrictDto;
import de.starwit.persistence.entity.StreetCatalogEntity;
import de.starwit.persistence.repository.StreetCatalogRepository;

@Service
public class StreetCatalogService implements ServiceInterface<StreetCatalogEntity, StreetCatalogRepository> {

    private static final Logger LOG = LoggerFactory.getLogger(StreetCatalogService.class);

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
        List<StreetWithDistrictDto> result = repository.findStreetsByCityWithDistrict(city);
        return result;
    }

    public List<StreetCatalogEntity> findByCityDistrict(String city, String districtName) {
        List<StreetCatalogEntity> result = repository.findByCityDistrict(city, districtName);
        return result;
    }
}
