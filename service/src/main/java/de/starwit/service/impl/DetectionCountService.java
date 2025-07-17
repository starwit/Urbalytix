package de.starwit.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.starwit.persistence.entity.DetectionCountEntity;
import de.starwit.persistence.repository.DetectionCountRepository;

@Service
public class DetectionCountService implements ServiceInterface<DetectionCountEntity, DetectionCountRepository> {

    @Autowired
    private DetectionCountRepository repository;

    @Override
    public DetectionCountRepository getRepository() {
        return repository;
    }

}
