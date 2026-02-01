package de.starwit.persistence.repository;

import de.starwit.persistence.entity.ConfigurationEntity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConfigurationRepository extends JpaRepository<ConfigurationEntity, Long> {

    ConfigurationEntity findByKeyname(String key);

}
