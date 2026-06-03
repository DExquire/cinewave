package com.cinewave.client;

import com.cinewave.config.TvMazeProperties;
import com.cinewave.web.error.UpstreamException;
import com.fasterxml.jackson.databind.JsonNode;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

/**
 * Low-level gateway to the free TVMaze API. Callers pass relative paths; this builds
 * the absolute URI and returns the raw JSON for the mapper to normalise.
 */
@Component
public class TvMazeClient {

    private final RestClient http;
    private final TvMazeProperties props;

    public TvMazeClient(RestClient tvMazeRestClient, TvMazeProperties props) {
        this.http = tvMazeRestClient;
        this.props = props;
    }

    /** One 250-item page of the global show index, ordered by id. */
    public JsonNode showsPage(int page) {
        return get("/shows?page=" + page);
    }

    /** A single show with cast and episodes embedded. */
    public JsonNode show(long id) {
        return get("/shows/" + id + "?embed%5B%5D=cast&embed%5B%5D=episodes");
    }

    /** Full-text show search. */
    public JsonNode search(String query) {
        return get("/search/shows?q=" + URLEncoder.encode(query, StandardCharsets.UTF_8));
    }

    public int catalogPages() {
        return props.getCatalogPages();
    }

    private JsonNode get(String relativePath) {
        try {
            return http.get()
                    .uri(URI.create(props.getBaseUrl() + relativePath))
                    .retrieve()
                    .body(JsonNode.class);
        } catch (Exception ex) {
            throw new UpstreamException("TVMaze request failed for " + relativePath, ex);
        }
    }
}
