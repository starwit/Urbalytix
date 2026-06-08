package de.starwit.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.ZonedDateTime;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import de.starwit.persistence.entity.VehicleDataEntity;
import de.starwit.persistence.repository.VehicleDataRepository;
import de.starwit.service.messagelistener.MessageMonotonicityCache;
import de.starwit.service.messagelistener.MessageMonotonicityCache.CheckTimestampResult;

@ExtendWith(MockitoExtension.class)
public class MessageMonotonicityCacheTest {

    @Mock
    private VehicleDataRepository vehicleDataRepository;

    @InjectMocks
    private MessageMonotonicityCache testee;

    @BeforeEach
    public void setUp() {
        ReflectionTestUtils.setField(testee, "enabled", true);
    }

    // --- enabled=true ---

    @Test
    public void testFirstTimestampAccepted_noDbEntry() {
        when(vehicleDataRepository.findByStreamKey("vehicle1")).thenReturn(null);

        CheckTimestampResult result = testee.checkTimestamp("prefix:vehicle1", 1000L);

        assertTrue(result.accepted());
        assertEquals(0L, result.timestampSkew());
    }

    @Test
    public void testFirstTimestampAccepted_dbEntryWithLastUpdate() {
        VehicleDataEntity entity = new VehicleDataEntity();
        entity.setLastUpdate(ZonedDateTime.parse("1970-01-01T00:00:00.500Z"));
        when(vehicleDataRepository.findByStreamKey("vehicle1")).thenReturn(entity);

        CheckTimestampResult result = testee.checkTimestamp("prefix:vehicle1", 1000L);

        assertTrue(result.accepted());
        assertEquals(0L, result.timestampSkew());
    }

    @Test
    public void testTimestampRejected_whenOlderThanDbEntry() {
        VehicleDataEntity entity = new VehicleDataEntity();
        entity.setLastUpdate(ZonedDateTime.parse("1970-01-01T00:00:02.000Z")); // 2000ms
        when(vehicleDataRepository.findByStreamKey("vehicle1")).thenReturn(entity);

        CheckTimestampResult result = testee.checkTimestamp("prefix:vehicle1", 1000L);

        assertFalse(result.accepted());
        assertEquals(1000L, result.timestampSkew());
    }

    @Test
    public void testSecondTimestampAccepted_whenNewer() {
        when(vehicleDataRepository.findByStreamKey("vehicle1")).thenReturn(null);

        testee.checkTimestamp("prefix:vehicle1", 1000L);
        CheckTimestampResult result = testee.checkTimestamp("prefix:vehicle1", 2000L);

        assertTrue(result.accepted());
        assertEquals(0L, result.timestampSkew());
    }

    @Test
    public void testSecondTimestampRejected_whenOlder() {
        when(vehicleDataRepository.findByStreamKey("vehicle1")).thenReturn(null);

        testee.checkTimestamp("prefix:vehicle1", 2000L);
        CheckTimestampResult result = testee.checkTimestamp("prefix:vehicle1", 1000L);

        assertFalse(result.accepted());
        assertEquals(1000L, result.timestampSkew());
    }

    @Test
    public void testSameTimestampRejected() {
        when(vehicleDataRepository.findByStreamKey("vehicle1")).thenReturn(null);

        testee.checkTimestamp("prefix:vehicle1", 1000L);
        CheckTimestampResult result = testee.checkTimestamp("prefix:vehicle1", 1000L);

        assertFalse(result.accepted());
        assertEquals(0L, result.timestampSkew());
    }

    @Test
    public void testLazyInit_calledOnlyOnce_perStreamKey() {
        when(vehicleDataRepository.findByStreamKey("vehicle1")).thenReturn(null);

        testee.checkTimestamp("prefix:vehicle1", 1000L);
        testee.checkTimestamp("prefix:vehicle1", 2000L);
        testee.checkTimestamp("prefix:vehicle1", 3000L);

        verify(vehicleDataRepository, times(1)).findByStreamKey("vehicle1");
    }

    @Test
    public void testDifferentStreamKeys_areIndependent() {
        when(vehicleDataRepository.findByStreamKey("vehicleA")).thenReturn(null);
        when(vehicleDataRepository.findByStreamKey("vehicleB")).thenReturn(null);

        testee.checkTimestamp("prefix:vehicleA", 5000L);

        CheckTimestampResult resultB = testee.checkTimestamp("prefix:vehicleB", 1000L);

        assertTrue(resultB.accepted());
        assertEquals(0L, resultB.timestampSkew());
    }

    @Test
    public void testDbEntryWithNullLastUpdate_treatedAsZero() {
        VehicleDataEntity entity = new VehicleDataEntity();
        entity.setLastUpdate(null);
        when(vehicleDataRepository.findByStreamKey("vehicle1")).thenReturn(entity);

        CheckTimestampResult result = testee.checkTimestamp("prefix:vehicle1", 1000L);

        assertTrue(result.accepted());
        assertEquals(0L, result.timestampSkew());
    }

    // --- enabled=false ---

    @Test
    public void testDisabled_monotonicTimestampAccepted() {
        ReflectionTestUtils.setField(testee, "enabled", false);

        CheckTimestampResult result = testee.checkTimestamp("prefix:vehicle1", 1000L);

        assertTrue(result.accepted());
        assertEquals(0L, result.timestampSkew());
    }

    @Test
    public void testDisabled_nonMonotonicTimestampAccepted() {
        ReflectionTestUtils.setField(testee, "enabled", false);

        testee.checkTimestamp("prefix:vehicle1", 5000L);
        CheckTimestampResult result = testee.checkTimestamp("prefix:vehicle1", 1000L);

        assertTrue(result.accepted());
        assertEquals(0L, result.timestampSkew());
    }

    @Test
    public void testDisabled_repositoryNotQueried() {
        ReflectionTestUtils.setField(testee, "enabled", false);

        testee.checkTimestamp("prefix:vehicle1", 1000L);

        verifyNoInteractions(vehicleDataRepository);
    }
}
