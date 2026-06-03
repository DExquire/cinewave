package com.cinewave.web.controller;

import com.cinewave.model.MoviePage;
import com.cinewave.service.CatalogService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class DiscoverController {

    private final CatalogService catalog;

    public DiscoverController(CatalogService catalog) {
        this.catalog = catalog;
    }

    @GetMapping("/discover")
    public MoviePage discover(@RequestParam(required = false) String genre,
                              @RequestParam(defaultValue = "popularity") String sort,
                              @RequestParam(defaultValue = "1") int page) {
        return catalog.discover(genre, sort, page);
    }

    @GetMapping("/genres")
    public List<String> genres() {
        return catalog.genres();
    }
}
