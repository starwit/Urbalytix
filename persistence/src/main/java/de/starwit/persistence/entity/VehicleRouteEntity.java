package de.starwit.persistence.entity;

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

    public VehicleDataEntity getVehicleData() {
        return vehicleData;
    }

    public void setVehicleData(VehicleDataEntity vehicleData) {
        this.vehicleData = vehicleData;
    }
}
