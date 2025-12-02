package de.starwit.persistence.dto;

public class DetectionCountDistrictDTO {

    private long districtId;
    private String districtName;
    private String className;
    private long totalCount;

    public DetectionCountDistrictDTO(long districtId, String districtName, String className, long totalCount) {
        this.districtId = districtId;
        this.districtName = districtName;
        this.className = className;
        this.totalCount = totalCount;
    }

    public long getDistrictId() {
        return districtId;
    }

    public void setDistrictId(long districtId) {
        this.districtId = districtId;
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
