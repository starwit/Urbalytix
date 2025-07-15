package de.starwit.persistence.entity;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonFilter;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import de.starwit.persistence.serializer.ZonedDateTimeDeserializer;
import de.starwit.persistence.serializer.ZonedDateTimeSerializer;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

/**
 * Decision Entity class
 */
@Entity
@Table(name = "decision")
public class DecisionEntity extends AbstractEntity<Long> {

    // entity fields
    @Column(name = "acquisitiontime")
    @JsonSerialize(using = ZonedDateTimeSerializer.class)
    @JsonDeserialize(using = ZonedDateTimeDeserializer.class)
    private ZonedDateTime acquisitionTime;

    @Column(name = "cameralatitude")
    private BigDecimal cameraLatitude;

    @Column(name = "cameralongitude")
    private BigDecimal cameraLongitude;

    @Column(name = "description")
    private String description;

    // entity fields getters and setters
    public ZonedDateTime getAcquisitionTime() {
        return acquisitionTime;
    }

    public void setAcquisitionTime(ZonedDateTime acquisitionTime) {
        this.acquisitionTime = acquisitionTime;
    }

    public BigDecimal getCameraLatitude() {
        return cameraLatitude;
    }

    public void setCameraLatitude(BigDecimal cameraLatitude) {
        this.cameraLatitude = cameraLatitude;
    }

    public BigDecimal getCameraLongitude() {
        return cameraLongitude;
    }

    public void setCameraLongitude(BigDecimal cameraLongitude) {
        this.cameraLongitude = cameraLongitude;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

}
