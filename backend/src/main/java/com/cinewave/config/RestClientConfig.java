package com.cinewave.config;

import java.time.Duration;
import org.springframework.boot.web.client.ClientHttpRequestFactories;
import org.springframework.boot.web.client.ClientHttpRequestFactorySettings;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

/** A {@link RestClient} with sane timeouts. Callers pass absolute TVMaze URIs. */
@Configuration
public class RestClientConfig {

    @Bean
    RestClient tvMazeRestClient() {
        var settings = ClientHttpRequestFactorySettings.DEFAULTS
                .withConnectTimeout(Duration.ofSeconds(5))
                .withReadTimeout(Duration.ofSeconds(10));
        return RestClient.builder()
                .requestFactory(ClientHttpRequestFactories.get(settings))
                .defaultHeader("Accept", "application/json")
                .build();
    }
}
