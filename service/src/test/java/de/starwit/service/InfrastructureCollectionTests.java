package de.starwit.service;

import static org.junit.jupiter.api.Assertions.*;

import java.nio.charset.StandardCharsets;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.FileCopyUtils;

import de.starwit.service.impl.InfrastructureCollectionService;

@Import(TestServiceConfiguration.class)
@SpringBootTest
public class InfrastructureCollectionTests {

    @Autowired
    private InfrastructureCollectionService collectionService;

    @Test
    void testTrashBinResultParsing() throws Exception {
        ClassPathResource odpResultRes = new ClassPathResource("sample_trash_bin_data.json");
        byte[] binaryData = FileCopyUtils.copyToByteArray(odpResultRes.getInputStream());
        String strJson = new String(binaryData, StandardCharsets.UTF_8);

        var fc = collectionService.parseGeoFeatures(strJson);

        assertEquals(1187, fc.getFeatures().size());
    }

}
