package de.starwit.persistence.dto;

public class StreetWithDistrictDto {

    private long id;
    private String city;
    private String districtName;
    private String streetName;

    public StreetWithDistrictDto(long id, String city, String districtName, String streetName) {
        this.id = id;
        this.city = city;
        this.districtName = districtName;
        this.streetName = streetName;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getDistrictName() {
        return districtName;
    }

    public void setDistrictName(String districtName) {
        this.districtName = districtName;
    }

    public String getStreetName() {
        return streetName;
    }

    public void setStreetName(String streetName) {
        this.streetName = streetName;
    }
}
