package de.starwit.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.ZonedDateTime;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import de.starwit.persistence.entity.VehicleDataEntity;
import de.starwit.persistence.repository.VehicleDataRepository;
import de.starwit.service.impl.MessageMonotonicityService;
import de.starwit.service.impl.MessageMonotonicityService.AdvanceTimestampResult;

@SpringBootTest(classes = { MessageMonotonicityService.class })
public class MessageMonotonicityServiceTest {

    @MockitoBean
    private VehicleDataRepository vehicleDataRepository;

    @Autowired
    private MessageMonotonicityService testee;

    @Test
    public void testFirstTimestampAccepted_noDbEntry() {
        when(vehicleDataRepository.findByStreamKey("stream1")).thenReturn(null);

        AdvanceTimestampResult result = testee.advanceTimestamp("prefix:stream1", 1000L);

        assertTrue(result.accepted());
        assertEquals(0L, result.timestampSkew());
    }

    @Test
    public void testFirstTimestampAccepted_dbEntryWithLastUpdate() {
        VehicleDataEntity entity = new VehicleDataEntity();
        entity.setLastUpdate(ZonedDateTime.parse("1970-01-01T00:00:00.500Z"));
        when(vehicleDataRepository.findByStreamKey("stream2")).thenReturn(entity);

        AdvanceTimestampResult result = testee.advanceTimestamp("prefix:stream2", 1000L);

        assertTrue(result.accepted());
        assertEquals(0L, result.timestampSkew());
    }

    @Test
    public void testTimestampRejected_whenOlderThanDbEntry() {
        VehicleDataEntity entity = new VehicleDataEntity();
        entity.setLastUpdate(ZonedDateTime.parse("1970-01-01T00:00:02.000Z")); // 2000ms
        when(vehicleDataRepository.findByStreamKey("stream3")).thenReturn(entity);

        AdvanceTimestampResult result = testee.advanceTimestamp("prefix:stream3", 1000L);

        assertFalse(result.accepted());
        assertEquals(1000L, result.timestampSkew());
    }

    @Test
    public void testSecondTimestampAccepted_whenNewer() {
        when(vehicleDataRepository.findByStreamKey("stream4")).thenReturn(null);

        testee.advanceTimestamp("prefix:stream4", 1000L);
        AdvanceTimestampResult result = testee.advanceTimestamp("prefix:stream4", 2000L);

        assertTrue(result.accepted());
        assertEquals(0L, result.timestampSkew());
    }

    @Test
    public void testSecondTimestampRejected_whenOlder() {
        when(vehicleDataRepository.findByStreamKey("stream5")).thenReturn(null);

        testee.advanceTimestamp("prefix:stream5", 2000L);
        AdvanceTimestampResult result = testee.advanceTimestamp("prefix:stream5", 1000L);

        assertFalse(result.accepted());
        assertEquals(1000L, result.timestampSkew());
    }

    @Test
    public void testSameTimestampRejected() {
        when(vehicleDataRepository.findByStreamKey("stream6")).thenReturn(null);

        testee.advanceTimestamp("prefix:stream6", 1000L);
        AdvanceTimestampResult result = testee.advanceTimestamp("prefix:stream6", 1000L);

        assertFalse(result.accepted());
        assertEquals(0L, result.timestampSkew());
    }

    @Test
    public void testLazyInit_calledOnlyOnce_perStreamKey() {
        when(vehicleDataRepository.findByStreamKey("stream7")).thenReturn(null);

        testee.advanceTimestamp("prefix:stream7", 1000L);
        testee.advanceTimestamp("prefix:stream7", 2000L);
        testee.advanceTimestamp("prefix:stream7", 3000L);

        verify(vehicleDataRepository, times(1)).findByStreamKey("stream7");
    }

    @Test
    public void testDifferentStreamKeys_areIndependent() {
        when(vehicleDataRepository.findByStreamKey("streamA")).thenReturn(null);
        when(vehicleDataRepository.findByStreamKey("streamB")).thenReturn(null);

        testee.advanceTimestamp("prefix:streamA", 5000L);

        AdvanceTimestampResult resultB = testee.advanceTimestamp("prefix:streamB", 1000L);

        assertTrue(resultB.accepted());
        assertEquals(0L, resultB.timestampSkew());
    }

    @Test
    public void testDbEntryWithNullLastUpdate_treatedAsZero() {
        VehicleDataEntity entity = new VehicleDataEntity();
        entity.setLastUpdate(null);
        when(vehicleDataRepository.findByStreamKey("stream8")).thenReturn(entity);

        AdvanceTimestampResult result = testee.advanceTimestamp("prefix:stream8", 1000L);

        assertTrue(result.accepted());
        assertEquals(0L, result.timestampSkew());
    }
}
