package de.starwit.persistence.dto;

import java.time.ZonedDateTime;

import org.locationtech.jts.geom.Geometry;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import de.starwit.persistence.serializer.ZonedDateTimeDeserializer;
import de.starwit.persistence.serializer.ZonedDateTimeSerializer;

public class MilagePerWeekDto {

    private long vehicleId;

    @JsonSerialize(using = ZonedDateTimeSerializer.class)
    @JsonDeserialize(using = ZonedDateTimeDeserializer.class)
    private ZonedDateTime effectiveDay;

    private double meters;

    private Geometry path;

    public MilagePerWeekDto() {
    }

    public MilagePerWeekDto(long vehicleId, ZonedDateTime effectiveDay, double meters) {
        this.vehicleId = vehicleId;
        this.effectiveDay = effectiveDay;
        this.meters = meters;
    }

    public long getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public ZonedDateTime getEffectiveDay() {
        return effectiveDay;
    }

    public void setEffectiveDay(ZonedDateTime day) {
        this.effectiveDay = day;
    }

    public double getMeters() {
        return meters;
    }

    public void setMeters(double meters) {
        this.meters = meters;
    }

    public Geometry getPath() {
        return path;
    }

    public void setPath(Geometry path) {
        this.path = path;
    }
}
