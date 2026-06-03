package com.cinewave.model;

import java.util.List;

/** Compact show card used in carousels and grids. Image paths are absolute URLs. */
public record MovieSummary(
        long id,
        String title,
        String overview,
        String posterPath,
        String backdropPath,
        String releaseDate,
        Double voteAverage,
        Integer voteCount,
        List<String> genres
) {}
