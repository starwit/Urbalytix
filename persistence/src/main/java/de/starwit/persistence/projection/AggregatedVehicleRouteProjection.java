package de.starwit.persistence.projection;

import java.math.BigDecimal;
import java.time.Instant;

public record AggregatedVehicleRouteProjection (
    Instant timestamp,
    Long vehicleId,
    BigDecimal speedKmhAvg,
    Long numPoints,
    Double longitude,
    Double latitude
) {}
