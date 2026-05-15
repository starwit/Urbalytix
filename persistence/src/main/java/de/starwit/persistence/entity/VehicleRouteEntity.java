package de.starwit.persistence.entity;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

import org.locationtech.jts.geom.Point;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "vehicleroutes")
public class VehicleRouteEntity extends AbstractEntity<Long> {

    @Column(name = "location", columnDefinition = "geometry(Point,4326)")
    private Point location;

    @Column(name = "update_ts")
    private ZonedDateTime updateTimestamp;

    @Column(name = "speed_kmh")
    private BigDecimal speedKmh;

    @Column(name = "heading_deg")
    private BigDecimal headingDeg;

    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private VehicleDataEntity vehicleData;

    public Point getLocation() {
        return location;
    }

    public void setLocation(Point location) {
        this.location = location;
    }

    public ZonedDateTime getUpdateTimestamp() {
        return updateTimestamp;
    }

    public void setUpdateTimestamp(ZonedDateTime updateTimestamp) {
        this.updateTimestamp = updateTimestamp;
    }

    public BigDecimal getSpeedKmh() {
        return speedKmh;
    }

    public void setSpeedKmh(BigDecimal speedKmh) {
        this.speedKmh = speedKmh;
    }

    public BigDecimal getHeadingDeg() {
        return headingDeg;
    }

    public void setHeadingDeg(BigDecimal headingDeg) {
        this.headingDeg = headingDeg;
    }

    public VehicleDataEntity getVehicleData() {
        return vehicleData;
    }

    public void setVehicleData(VehicleDataEntity vehicleData) {
        this.vehicleData = vehicleData;
    }

    @Override
    public String toString() {
        return "VehicleRouteEntity [id=" + id + ", location=" + location + ", updateTimestamp=" + updateTimestamp
                + ", speedKmh=" + speedKmh + ", headingDeg=" + headingDeg + ", vehicleData=" + vehicleData + "]";
    }
}
