package de.starwit.service.dto;

import java.util.ArrayList;
import java.util.List;

public class AggregatedVehicleRouteSectionDto {
    private List<AggregatedVehicleRouteDto> sectionPoints = new ArrayList<>();

    public List<AggregatedVehicleRouteDto> getSectionPoints() {
        return sectionPoints;
    }

    public void setSectionPoints(List<AggregatedVehicleRouteDto> sections) {
        this.sectionPoints = sections;
    }
}
