package de.starwit.service.dto;

import java.time.ZonedDateTime;
import java.util.Map;

import org.locationtech.jts.geom.Point;

import de.starwit.persistence.entity.VehicleDataEntity;

public class VehicleStatisticsDto {

    private long id;

    private String name;

    private String streamKey;

    private String description;

    private Point location;

    private ZonedDateTime lastUpdate;

    Map<ZonedDateTime, Double> distances = new java.util.HashMap<>();

    Map<ZonedDateTime, Double> cleaningDistances = new java.util.HashMap<>();

    public VehicleStatisticsDto() {
    }

    public VehicleStatisticsDto(VehicleDataEntity entity) {
        this.id = entity.getId();
        this.name = entity.getName();
        this.streamKey = entity.getStreamKey();
        this.description = entity.getDescription();
        this.location = entity.getLocation();
        this.lastUpdate = entity.getLastUpdate();
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

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

    public void setLastUpdate(ZonedDateTime lastUpdate) {
        this.lastUpdate = lastUpdate;
    }

    public Map<ZonedDateTime, Double> getDistances() {
        return distances;
    }

    public void setDistances(Map<ZonedDateTime, Double> distances) {
        this.distances = distances;
    }

    public Map<ZonedDateTime, Double> getCleaningDistances() {
        return cleaningDistances;
    }

    public void setCleaningDistances(Map<ZonedDateTime, Double> cleaningDistances) {
        this.cleaningDistances = cleaningDistances;
    }
}
