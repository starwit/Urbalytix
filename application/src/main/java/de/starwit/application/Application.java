package de.starwit.application;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication(scanBasePackages = {
        "de.starwit.rest",
        "de.starwit.service",
        "de.starwit.persistence",
        "de.starwit.application.config"
})
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(new Class[] { Application.class }, args);
    }

    @Bean
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
        requestFactory.setConnectionRequestTimeout(3000);

        restTemplate.setRequestFactory(requestFactory);
        return restTemplate;
    }
}
