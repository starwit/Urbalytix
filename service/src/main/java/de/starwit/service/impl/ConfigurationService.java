package de.starwit.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.starwit.persistence.entity.ConfigurationEntity;
import de.starwit.persistence.repository.ConfigurationRepository;

@Service
public class ConfigurationService implements ServiceInterface<ConfigurationEntity, ConfigurationRepository> {

    @Autowired
    private ConfigurationRepository repository;

    @Override
    public ConfigurationRepository getRepository() {
        return repository;
    }

    public ConfigurationEntity findByKey(String key) {
        return repository.findByKeyname(key);
    }
}
