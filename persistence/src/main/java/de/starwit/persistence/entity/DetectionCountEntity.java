package de.starwit.persistence.entity;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

import org.locationtech.jts.geom.Point;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import de.starwit.persistence.serializer.GeometrySerializer;
import de.starwit.persistence.serializer.ZonedDateTimeDeserializer;
import de.starwit.persistence.serializer.ZonedDateTimeSerializer;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "detection_count")
public class DetectionCountEntity extends AbstractEntity<Long> {

    // entity fields
    @Column(name = "detection_time")
    @JsonSerialize(using = ZonedDateTimeSerializer.class)
    @JsonDeserialize(using = ZonedDateTimeDeserializer.class)
    private ZonedDateTime detectionTime;

    @Column(name = "location", columnDefinition = "geometry(Point,4326)")
    @JsonSerialize(using = GeometrySerializer.class)
    private Point location;

    @Column(name = "class_name")
    private String className;

    @NotNull
    @Column(name = "count", nullable = false)
    private Integer count = 0;

    // getters and setters
    public ZonedDateTime getDetectionTime() {
        return detectionTime;
    }

    public void setDetectionTime(ZonedDateTime detectionTime) {
        this.detectionTime = detectionTime;
    }

    public Point getLocation() {
        return location;
    }

    public void setLocation(Point location) {
        this.location = location;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }
}
