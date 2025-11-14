package de.starwit.persistence.serializer;

import java.io.IOException;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.Geometry;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

public class GeometrySerializer extends JsonSerializer<Geometry> {

    @Override
    public void serialize(Geometry value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        Coordinate[] coordinates = value.getCoordinates();
        if (coordinates != null && coordinates.length > 0) {
            for (Coordinate coordinate : coordinates) {
                double[] doubleArray = new double[2];
                doubleArray[0] = coordinate.getX();
                doubleArray[1] = coordinate.getY();
                gen.writeObject(doubleArray);
            }
        }
    }
}