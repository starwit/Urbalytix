package de.starwit.persistence.repository;

import java.io.IOException;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;

import de.starwit.persistence.dto.MilagePerWeekDto;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

@Repository
public class NativeQueryRepository {

    private final static Logger log = LoggerFactory.getLogger(NativeQueryRepository.class);

    @PersistenceContext
    EntityManager entityManager;

    public List<MilagePerWeekDto> getRoutesLengthPerDayinWeekYear(@Param("week") int week, @Param("year") int year) {
        List<MilagePerWeekDto> result = new ArrayList<>();
        String query = """
                SELECT
                    vehicle_id,
                    effective_day,
                    ST_Length(geography(ST_MakeLine(location ORDER BY update_ts))) AS meters
                FROM (
                    SELECT vehicle_id,
                            time_bucket('1 day', update_ts) AS effective_day,
                            update_ts,
                            location
                    FROM vehicleroutes
                        WHERE EXTRACT(ISOYEAR FROM update_ts) = :year
                        AND EXTRACT(WEEK FROM update_ts) = :week
                    ) t
                GROUP BY vehicle_id, effective_day
                ORDER BY vehicle_id, effective_day
                        """;

        Query nativeQuery = entityManager.createNativeQuery(query, Object.class)
                .setParameter("week", week)
                .setParameter("year", year);

        List<Object[]> resultSet = nativeQuery.getResultList();
        for (Object[] row : resultSet) {
            log.debug("Result set for calculated route length " + row[0] + " " + row[1] + " " + row[2]);
            Instant instant = (java.time.Instant) row[1];
            ZonedDateTime zdt = instant.atZone(ZoneId.of("Europe/Berlin"));
            MilagePerWeekDto dto = new MilagePerWeekDto((Long) row[0], zdt, (Double) row[2]);
            result.add(dto);
        }
        return result;
    }
}
