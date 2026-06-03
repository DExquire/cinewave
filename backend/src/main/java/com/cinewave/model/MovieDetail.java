package com.cinewave.model;

import java.util.List;

/** Full show page: details + genres + cast + network/season stats + "more like this". */
public record MovieDetail(
        long id,
        String title,
        String tagline,
        String overview,
        String posterPath,
        String backdropPath,
        String releaseDate,
        Integer runtime,
        Double voteAverage,
        Integer voteCount,
        String status,
        List<String> genres,
        String network,
        String ended,
        Integer seasons,
        Integer episodes,
        List<CastMember> cast,
        List<MovieSummary> similar
) {}
