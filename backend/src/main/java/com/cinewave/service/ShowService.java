package com.cinewave.service;

import com.cinewave.client.ShowMapper;
import com.cinewave.client.TvMazeClient;
import com.cinewave.model.MovieDetail;
import com.cinewave.model.MoviePage;
import com.cinewave.model.MovieSummary;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

/** Show details and search. "More like this" is computed from shared genres. */
@Service
public class ShowService {

    private final TvMazeClient client;
    private final ShowMapper mapper;
    private final CatalogService catalog;

    public ShowService(TvMazeClient client, ShowMapper mapper, CatalogService catalog) {
        this.client = client;
        this.mapper = mapper;
        this.catalog = catalog;
    }

    @Cacheable(value = "details", key = "#id")
    public MovieDetail detail(long id) {
        MovieDetail base = mapper.toDetail(client.show(id));
        return withSimilar(base);
    }

    @Cacheable(value = "search", key = "#query")
    public MoviePage search(String query) {
        if (query == null || query.isBlank()) {
            return new MoviePage(1, 0, 0, List.of());
        }
        var root = client.search(query);
        List<MovieSummary> results = new java.util.ArrayList<>();
        if (root != null && root.isArray()) {
            root.forEach(hit -> results.add(mapper.toSummary(hit.path("show"))));
        }
        return new MoviePage(1, 1, results.size(), results);
    }

    /** Ranks catalog shows by how many genres they share with the given show. */
    private MovieDetail withSimilar(MovieDetail d) {
        Set<String> genres = Set.copyOf(d.genres());
        if (genres.isEmpty()) return d;

        List<MovieSummary> similar = catalog.catalog().stream()
                .map(CatalogService.Entry::summary)
                .filter(s -> s.id() != d.id())
                .map(s -> Map.entry(s, overlap(genres, s.genres())))
                .filter(e -> e.getValue() > 0)
                .sorted(Comparator.<Map.Entry<MovieSummary, Long>>comparingLong(Map.Entry::getValue).reversed())
                .limit(12)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        return new MovieDetail(
                d.id(), d.title(), d.tagline(), d.overview(), d.posterPath(), d.backdropPath(),
                d.releaseDate(), d.runtime(), d.voteAverage(), d.voteCount(), d.status(), d.genres(),
                d.network(), d.ended(), d.seasons(), d.episodes(), d.cast(), similar);
    }

    private long overlap(Set<String> a, List<String> b) {
        return b.stream().filter(a::contains).count();
    }
}
