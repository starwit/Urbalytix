package de.starwit.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.starwit.persistence.entity.DecisionEntity;
import de.starwit.persistence.repository.DecisionRepository;

/**
 * 
 * Decision Service class
 *
 */
@Service
public class DecisionService implements ServiceInterface<DecisionEntity, DecisionRepository> {

    @Autowired
    private DecisionRepository decisionRepository;

    @Override
    public DecisionRepository getRepository() {
        return decisionRepository;
    }

}
