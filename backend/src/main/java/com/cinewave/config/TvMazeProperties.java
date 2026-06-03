package com.cinewave.config;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/**
 * Configuration for the TVMaze integration. TVMaze is a free, open API that needs
 * no key or registration — so there is nothing secret here, only tunables.
 */
@Validated
@ConfigurationProperties(prefix = "tvmaze")
public class TvMazeProperties {

    /** TVMaze REST base URL. */
    @NotBlank
    private String baseUrl = "https://api.tvmaze.com";

    /** How many 250-item index pages to pull into the in-memory catalog. */
    @Positive
    private int catalogPages = 3;

    public String getBaseUrl() { return baseUrl; }
    public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }

    public int getCatalogPages() { return catalogPages; }
    public void setCatalogPages(int catalogPages) { this.catalogPages = catalogPages; }
}
