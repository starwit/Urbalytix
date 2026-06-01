package de.starwit.service.mapper;

import de.starwit.persistence.projection.AggregatedVehicleRouteProjection;
import de.starwit.service.dto.AggregatedVehicleRouteDto;

public class AggregatedVehicleRouteMapper implements Mapper<AggregatedVehicleRouteDto, AggregatedVehicleRouteProjection> {

    @Override
    public AggregatedVehicleRouteDto toDto(AggregatedVehicleRouteProjection projection) {
        if (projection == null) {
            return null;
        }
        AggregatedVehicleRouteDto dto = new AggregatedVehicleRouteDto();
        dto.setTimestamp(projection.timestamp());
        dto.setVehicleId(projection.vehicleId());
        dto.setSpeedKmhAvg(projection.speedKmhAvg());
        dto.setNumPoints(projection.numPoints());
        dto.setLongitude(projection.longitude());
        dto.setLatitude(projection.latitude());
        return dto;
    }

    @Override
    public AggregatedVehicleRouteProjection toEntity(AggregatedVehicleRouteDto dto) {
        throw new UnsupportedOperationException("toEntity is not supported for AggregatedVehicleRouteProjection");
    }
}
