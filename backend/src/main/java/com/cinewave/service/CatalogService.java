package com.cinewave.service;

import com.cinewave.client.ShowMapper;
import com.cinewave.client.TvMazeClient;
import com.cinewave.model.MoviePage;
import com.cinewave.model.MovieSummary;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.TreeSet;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

/**
 * TVMaze has no curated "trending/popular" endpoints, so CineWave builds them itself
 * from an in-memory catalog: a few index pages are fetched once, cached, then sorted
 * and filtered in different ways to power the home rows, browse and "more like this".
 */
@Service
public class CatalogService {

    private static final int PAGE_SIZE = 20;

    private final TvMazeClient client;
    private final ShowMapper mapper;

    public CatalogService(TvMazeClient client, ShowMapper mapper) {
        this.client = client;
        this.mapper = mapper;
    }

    /** A catalog row: the public summary plus the fields we sort/filter on. */
    public record Entry(MovieSummary summary, int weight, String status, String premiered, Double rating) {}

    /** Loads and caches the catalog (N pages of 250 shows). Refreshed by the cache TTL. */
    @Cacheable("catalog")
    public List<Entry> catalog() {
        List<Entry> entries = new ArrayList<>();
        for (int p = 0; p < client.catalogPages(); p++) {
            JsonNode page = client.showsPage(p);
            if (page == null || !page.isArray()) continue;
            for (JsonNode show : page) {
                entries.add(new Entry(
                        mapper.toSummary(show),
                        show.path("weight").asInt(0),
                        show.path("status").asText(""),
                        show.path("premiered").asText(null),
                        show.path("rating").path("average").isNumber()
                                ? show.path("rating").path("average").asDouble() : null
                ));
            }
        }
        return entries;
    }

    /** Home rows, each a distinct view over the same catalog. */
    @Cacheable(value = "lists", key = "#kind + ':' + #page")
    public MoviePage list(String kind, int page) {
        Comparator<Entry> byWeight = Comparator.comparingInt(Entry::weight).reversed();
        Comparator<Entry> byRating = Comparator.comparing(
                Entry::rating, Comparator.nullsLast(Comparator.reverseOrder()));
        Comparator<Entry> byPremiered = Comparator.comparing(
                Entry::premiered, Comparator.nullsLast(Comparator.reverseOrder()));

        List<Entry> all = catalog();
        List<Entry> filtered = switch (kind) {
            case "trending" -> all.stream().sorted(byWeight).toList();
            case "top_rated" -> all.stream().sorted(byRating.thenComparing(byWeight)).toList();
            case "now_playing" -> all.stream()
                    .filter(e -> "Running".equalsIgnoreCase(e.status()))
                    .sorted(byWeight).toList();
            case "upcoming" -> all.stream().sorted(byPremiered).toList();
            case "popular" -> all.stream() // "Modern Classics": finished, highly rated
                    .filter(e -> "Ended".equalsIgnoreCase(e.status()))
                    .sorted(byRating.thenComparing(byWeight)).toList();
            default -> throw new IllegalArgumentException("Unknown list: " + kind);
        };
        return paginate(filtered, page);
    }

    /** Genre-filtered, sortable discovery feed. */
    @Cacheable(value = "discover", key = "#genre + ':' + #sort + ':' + #page")
    public MoviePage discover(String genre, String sort, int page) {
        List<Entry> result = new ArrayList<>(catalog());
        if (genre != null && !genre.isBlank()) {
            String g = genre.toLowerCase(Locale.ROOT);
            result = result.stream()
                    .filter(e -> e.summary().genres().stream().anyMatch(x -> x.toLowerCase(Locale.ROOT).equals(g)))
                    .collect(java.util.stream.Collectors.toCollection(ArrayList::new));
        }
        Comparator<Entry> cmp = switch (sort == null ? "popularity" : sort) {
            case "rating" -> Comparator.comparing(Entry::rating, Comparator.nullsLast(Comparator.reverseOrder()));
            case "newest" -> Comparator.comparing(Entry::premiered, Comparator.nullsLast(Comparator.reverseOrder()));
            default -> Comparator.comparingInt(Entry::weight).reversed();
        };
        result.sort(cmp);
        return paginate(result, page);
    }

    /** Distinct, alphabetised list of genres present in the catalog. */
    @Cacheable("genres")
    public List<String> genres() {
        var set = new TreeSet<String>();
        for (Entry e : catalog()) set.addAll(e.summary().genres());
        return new ArrayList<>(set);
    }

    private MoviePage paginate(List<Entry> entries, int page) {
        int p = Math.max(1, page);
        int total = entries.size();
        int totalPages = Math.max(1, (int) Math.ceil(total / (double) PAGE_SIZE));
        int from = Math.min((p - 1) * PAGE_SIZE, total);
        int to = Math.min(from + PAGE_SIZE, total);
        List<MovieSummary> slice = entries.subList(from, to).stream().map(Entry::summary).toList();
        return new MoviePage(p, totalPages, total, slice);
    }
}
