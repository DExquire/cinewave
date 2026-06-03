package com.cinewave.model;

import java.util.List;

/** A paginated slice of movie summaries, mirroring TMDB's paging envelope. */
public record MoviePage(int page, int totalPages, int totalResults, List<MovieSummary> results) {}
