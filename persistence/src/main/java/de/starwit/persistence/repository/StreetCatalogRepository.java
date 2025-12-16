package de.starwit.persistence.repository;

import java.util.List;

import org.locationtech.jts.geom.Geometry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import de.starwit.persistence.dto.StreetWithDistrictDto;
import de.starwit.persistence.entity.StreetCatalogEntity;

@Repository
public interface StreetCatalogRepository extends JpaRepository<StreetCatalogEntity, Long> {

  public List<StreetCatalogEntity> findByCity(String city);

  @Query(value = "SELECT st_buffer(street_path, 0.0001) FROM street_catalog WHERE id = :streetname", nativeQuery = true)
  Geometry findStreetHull(@Param("streetname") long streetId);

  @Query(value = """
        SELECT
          new de.starwit.persistence.dto.StreetWithDistrictDto(
            s.id,
            s.city,
            d.name,
            s.streetName
          )
        FROM StreetCatalogEntity s
        JOIN CityDistrictEntity d
          ON s.city = d.city
         AND ST_Within(s.streetPath, d.districtGeometry)
        WHERE d.city = :city
        ORDER BY s.id
      """)
  List<StreetWithDistrictDto> findStreetsByCityWithDistrict(@Param("city") String city);

  @Query(value = """
      SELECT
          s.id AS street_id,
          s.city AS street_city,
          s.street_name,
          s.street_path
      FROM street_catalog s
      JOIN city_district d
        ON s.city = d.city
       AND ST_Within(s.street_path, d.district_geometry)
      WHERE d.city = :city
        AND d.name = :districtName
      """, nativeQuery = true)
  List<StreetCatalogEntity> findByCityDistrict(String city, String districtName);

  @Query(value = """
      SELECT
          s.id AS id,
          s.city AS city,
          s.street_name,
          s.street_path
      FROM street_catalog s
      JOIN city_district d
        ON s.city = d.city
       AND ST_Within(s.street_path, d.district_geometry)
      WHERE d.city = :city
        AND d.id = :districtId
      """, nativeQuery = true)
  List<StreetCatalogEntity> findByCityDistrictId(String city, long districtId);

}
