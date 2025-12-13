package de.starwit.persistence.dto;

public class DistrictWithDetectionCountDto {

    private long id;
    private String districtName;
    private String className;
    private long totalCount;

    public DistrictWithDetectionCountDto(long id, String districtName, String className, long totalCount) {
        this.id = id;
        this.districtName = districtName;
        this.className = className;
        this.totalCount = totalCount;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getDistrictName() {
        return districtName;
    }

    public void setDistrictName(String districtName) {
        this.districtName = districtName;
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
