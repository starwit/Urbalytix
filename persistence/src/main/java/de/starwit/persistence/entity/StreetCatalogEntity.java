package de.starwit.persistence.entity;

import org.locationtech.jts.geom.Geometry;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "street_catalog")
public class StreetCatalogEntity extends AbstractEntity<Long> {

    @Column(name = "city", nullable = false, length = 255)
    private String city;

    @Column(name = "street_name", nullable = false, length = 255)
    private String streetName;

    @Column(name = "street_path", nullable = false, columnDefinition = "geometry")
    private Geometry streetPath;

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getStreetName() {
        return streetName;
    }

    public void setStreetName(String streetName) {
        this.streetName = streetName;
    }

    public Geometry getStreetPath() {
        return streetPath;
    }

    public void setStreetPath(Geometry streetPath) {
        this.streetPath = streetPath;
    }

    @Override
    public String toString() {
        return "StreetCatalogEntity [id=\" + id + \", streetName=" + streetName + ", streetPath="
                + streetPath + "city=" + city + "]";
    }
}
