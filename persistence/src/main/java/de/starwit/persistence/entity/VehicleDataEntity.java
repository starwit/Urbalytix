package de.starwit.persistence.entity;

import java.time.ZonedDateTime;

import org.locationtech.jts.geom.Point;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import de.starwit.persistence.serializer.GeometrySerializer;
import de.starwit.persistence.serializer.ZonedDateTimeDeserializer;
import de.starwit.persistence.serializer.ZonedDateTimeSerializer;
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
    @JsonSerialize(using = GeometrySerializer.class)
    private Point location;

    @Column(name = "last_update")
    @JsonSerialize(using = ZonedDateTimeSerializer.class)
    @JsonDeserialize(using = ZonedDateTimeDeserializer.class)
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
