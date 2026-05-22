package de.starwit.service.dto;

import java.math.BigDecimal;
import java.time.Instant;

public class AggregatedVehicleRouteDto {
    private Instant timestamp;
    private Long vehicleId;
    private BigDecimal speedKmhAvg;
    private Long numPoints;
    private Double longitude;
    private Double latitude;
    private Double prevLongitude;
    private Double prevLatitude;

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public Long getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public BigDecimal getSpeedKmhAvg() {
        return speedKmhAvg;
    }

    public void setSpeedKmhAvg(BigDecimal speedKmhAvg) {
        this.speedKmhAvg = speedKmhAvg;
    }

    public Long getNumPoints() {
        return numPoints;
    }

    public void setNumPoints(Long numPoints) {
        this.numPoints = numPoints;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getPrevLongitude() {
        return prevLongitude;
    }

    public void setPrevLongitude(Double prevLongitude) {
        this.prevLongitude = prevLongitude;
    }

    public Double getPrevLatitude() {
        return prevLatitude;
    }

    public void setPrevLatitude(Double prevLatitude) {
        this.prevLatitude = prevLatitude;
    }
}
