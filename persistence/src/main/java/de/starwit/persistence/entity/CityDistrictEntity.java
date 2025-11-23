package de.starwit.persistence.entity;

import org.locationtech.jts.geom.Geometry;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "city_district")
public class CityDistrictEntity extends AbstractEntity<Long> {

    @Column(name = "city", nullable = false, length = 255)
    private String city;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "gmlid", nullable = false)
    private Integer gmlid;

    @Column(name = "district_government", nullable = true, length = 255)
    private String districtGovernment;

    @Column(name = "district_geometry", nullable = false, columnDefinition = "geometry")
    private Geometry districtGeometry;

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getGmlid() {
        return gmlid;
    }

    public void setGmlid(Integer gmlid) {
        this.gmlid = gmlid;
    }

    public String getDistrictGovernment() {
        return districtGovernment;
    }

    public void setDistrictGovernment(String districtGovernment) {
        this.districtGovernment = districtGovernment;
    }

    public Geometry getDistrictGeometry() {
        return districtGeometry;
    }

    public void setDistrictGeometry(Geometry districtGeometry) {
        this.districtGeometry = districtGeometry;
    }
}
