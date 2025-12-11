package de.starwit.persistence.dto;

public class StreetsWithDetectionCountDto {
    private long id;
    private String streetName;
    private String className;
    private long totalCount;

    public StreetsWithDetectionCountDto() {
    }

    public StreetsWithDetectionCountDto(long id, String streetName, String className, long totalCount) {
        this.id = id;
        this.streetName = streetName;
        this.className = className;
        this.totalCount = totalCount;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getStreetName() {
        return streetName;
    }

    public void setStreetName(String streetName) {
        this.streetName = streetName;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public long getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(long totalCount) {
        this.totalCount = totalCount;
    }
}
