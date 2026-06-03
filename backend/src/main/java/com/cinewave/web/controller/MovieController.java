package com.cinewave.web.controller;

import com.cinewave.model.MovieDetail;
import com.cinewave.model.MoviePage;
import com.cinewave.service.CatalogService;
import com.cinewave.service.ShowService;
import org.springframework.web.bind.annotation.*;

/**
 * Browsing endpoints for shows. The home "rows" are distinct views over the cached
 * TVMaze catalog (see {@link CatalogService}); details come from {@link ShowService}.
 */
@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final CatalogService catalog;
    private final ShowService shows;

    public MovieController(CatalogService catalog, ShowService shows) {
        this.catalog = catalog;
        this.shows = shows;
    }

    @GetMapping("/trending")
    public MoviePage trending() {
        return catalog.list("trending", 1);
    }

    @GetMapping("/popular")
    public MoviePage popular(@RequestParam(defaultValue = "1") int page) {
        return catalog.list("popular", page);
    }

    @GetMapping("/top-rated")
    public MoviePage topRated(@RequestParam(defaultValue = "1") int page) {
        return catalog.list("top_rated", page);
    }

    @GetMapping("/upcoming")
    public MoviePage upcoming(@RequestParam(defaultValue = "1") int page) {
        return catalog.list("upcoming", page);
    }

    @GetMapping("/now-playing")
    public MoviePage nowPlaying(@RequestParam(defaultValue = "1") int page) {
        return catalog.list("now_playing", page);
    }

    @GetMapping("/{id}")
    public MovieDetail detail(@PathVariable long id) {
        return shows.detail(id);
    }
}
