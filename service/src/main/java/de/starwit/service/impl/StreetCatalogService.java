package de.starwit.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.starwit.persistence.entity.StreetCatalogEntity;
import de.starwit.persistence.repository.StreetCatalogRepository;
import jakarta.annotation.PostConstruct;

@Service
public class StreetCatalogService implements ServiceInterface<StreetCatalogEntity, StreetCatalogRepository> {

    @Autowired
    private StreetCatalogRepository repository;

    @Override
    public StreetCatalogRepository getRepository() {
        return repository;
    }

    @PostConstruct
    void test() {
        repository.findAll().forEach(entity -> System.out.println(entity.getStreetName()));
    }

}
