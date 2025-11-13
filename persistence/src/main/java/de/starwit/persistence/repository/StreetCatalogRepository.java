package de.starwit.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import de.starwit.persistence.entity.StreetCatalogEntity;

@Repository
public interface StreetCatalogRepository extends JpaRepository<StreetCatalogEntity, Long> {

}
