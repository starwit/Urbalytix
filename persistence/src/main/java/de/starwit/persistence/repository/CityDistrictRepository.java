package de.starwit.persistence.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import de.starwit.persistence.entity.CityDistrictEntity;

@Repository
public interface CityDistrictRepository extends JpaRepository<CityDistrictEntity, Long> {

    List<CityDistrictEntity> findByCity(String city);

}
