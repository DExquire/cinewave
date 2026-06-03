package com.cinewave.web.controller;

import com.cinewave.model.MoviePage;
import com.cinewave.service.ShowService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final ShowService shows;

    public SearchController(ShowService shows) {
        this.shows = shows;
    }

    @GetMapping
    public MoviePage search(@RequestParam("q") String query) {
        return shows.search(query);
    }
}
