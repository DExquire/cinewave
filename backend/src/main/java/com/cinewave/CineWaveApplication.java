package com.cinewave;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.cache.annotation.EnableCaching;

/**
 * CineWave — a cinematic movie-discovery API.
 *
 * <p>The backend acts as a Backend-for-Frontend (BFF): it proxies The Movie Database
 * (TMDB) so the API key never reaches the browser, normalises TMDB's payloads into a
 * compact shape the Angular client consumes, and caches responses to stay well within
 * TMDB's rate limits.
 */
@SpringBootApplication
@ConfigurationPropertiesScan
@EnableCaching
public class CineWaveApplication {
    public static void main(String[] args) {
        SpringApplication.run(CineWaveApplication.class, args);
    }
}
