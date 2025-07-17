package de.starwit.rest.integration;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import de.starwit.persistence.entity.DetectionCountEntity;
import de.starwit.rest.controller.DetectionCountController;
import de.starwit.service.impl.DetectionCountService;

/**
 * Tests for DetectionCountController
 *
 * <pre>
 * @WebMvcTest also auto-configures MockMvc which offers a powerful way of
 * easy testing MVC controllers without starting a full HTTP server.
 * </pre>
 */
@WebMvcTest(controllers = DetectionCountController.class)
public class DetectionCountControllerIntegrationTest extends AbstractControllerIntegrationTest<DetectionCountEntity> {

    @MockitoBean
    private DetectionCountService detectionCountService;

    private static final String restpath = "/api/detection-count/";

    @Override
    public Class<DetectionCountEntity> getEntityClass() {
        return DetectionCountEntity.class;
    }

    @Override
    public String getRestPath() {
        return restpath;
    }

    // implement tests here
    @Test
    public void canRetrieveById() throws Exception {

        // DetectionCountEntity entityToTest = readFromFile(data +
        // "detectionCount.json");
        // when(appService.findById(0L)).thenReturn(entityToTest);

        // MockHttpServletResponse response = retrieveById(0L);

        // then
        // assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
        // assertThat(response.getContentAsString())
        // .isEqualTo(jsonAppDto.write(dto).getJson());
    }

}
