package de.starwit.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import de.starwit.persistence.entity.ActionEntity;
import de.starwit.persistence.entity.ActionState;
import de.starwit.persistence.entity.ActionTypeEntity;
import de.starwit.persistence.entity.DecisionEntity;
import de.starwit.persistence.entity.DecisionState;
import de.starwit.persistence.entity.DecisionTypeEntity;
import de.starwit.persistence.entity.ModuleEntity;
import de.starwit.persistence.repository.ActionRepository;
import de.starwit.persistence.repository.ActionTypeRepository;
import de.starwit.persistence.repository.DecisionRepository;
import de.starwit.persistence.repository.DecisionTypeRepository;
import de.starwit.persistence.repository.ModuleRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;

/**
 * 
 * Decision Service class
 *
 */
@Service
public class DecisionService implements ServiceInterface<DecisionEntity, DecisionRepository> {


    private final EntityManager entityManager;

    @Autowired
    private DecisionRepository decisionRepository;

    @Override
    public DecisionRepository getRepository() {
        return decisionRepository;
    }

    public DecisionService(EntityManager entityManager) {
        this.entityManager = entityManager;
    }
}
