package de.starwit.persistence.entity;

import java.time.ZonedDateTime;

import org.locationtech.jts.geom.Point;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "vehicledata")
public class VehicleDataEntity extends AbstractEntity<Long> {

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "streamkey", nullable = false)
    private String streamKey;

    @Column(name = "description")
    private String description;

    @Column(name = "location", columnDefinition = "geometry(Point,4326)")
    private Point location;

    @Column(name = "last_update")
    private ZonedDateTime lastUpdate;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStreamKey() {
        return streamKey;
    }

    public void setStreamKey(String streamKey) {
        this.streamKey = streamKey;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Point getLocation() {
        return location;
    }

    public void setLocation(Point location) {
        this.location = location;
    }

    public ZonedDateTime getLastUpdate() {
        return lastUpdate;
    }

    public void setLastUpdate(ZonedDateTime detectionTime) {
        this.lastUpdate = detectionTime;
    }
}
