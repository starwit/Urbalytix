package de.starwit.persistence.serializer;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.Point;
import org.springframework.boot.jackson.JacksonComponent;

import tools.jackson.core.JsonGenerator;
import tools.jackson.databind.SerializationContext;
import tools.jackson.databind.ValueSerializer;

@JacksonComponent
public class GeometryPointSerializer {

    public static class Serializer extends ValueSerializer<Point> {

        @Override
        public void serialize(Point point, JsonGenerator gen, SerializationContext context) {
            if (point == null) {
                gen.writeNull();
                return;
            }

            Coordinate[] coordinates = point.getCoordinates();
            if (coordinates != null && coordinates.length > 0) {
                for (Coordinate coordinate : coordinates) {
                    double[] doubleArray = new double[2];
                    doubleArray[0] = coordinate.getX();
                    doubleArray[1] = coordinate.getY();
                    gen.writeArray(doubleArray, 0, doubleArray.length);
                }
            }
        }

    }

}
