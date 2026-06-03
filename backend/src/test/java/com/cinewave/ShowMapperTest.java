package com.cinewave;

import static org.assertj.core.api.Assertions.assertThat;

import com.cinewave.client.ShowMapper;
import com.cinewave.model.MovieDetail;
import com.cinewave.model.MovieSummary;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

/** Unit tests for the pure TVMaze → domain mapping. No Spring context, no network. */
class ShowMapperTest {

    private final ShowMapper mapper = new ShowMapper();
    private final ObjectMapper json = new ObjectMapper();

    @Test
    void mapsSummaryAndStripsHtml() throws Exception {
        var node = json.readTree("""
            {
              "id": 82, "name": "Game of Thrones",
              "genres": ["Drama", "Adventure", "Fantasy"],
              "premiered": "2011-04-17",
              "rating": {"average": 8.9},
              "image": {"medium": "https://img/medium.jpg", "original": "https://img/original.jpg"},
              "summary": "<p>Based on the <b>bestselling</b> book series.</p>"
            }
            """);

        MovieSummary s = mapper.toSummary(node);

        assertThat(s.id()).isEqualTo(82);
        assertThat(s.title()).isEqualTo("Game of Thrones");
        assertThat(s.overview()).isEqualTo("Based on the bestselling book series.");
        assertThat(s.posterPath()).isEqualTo("https://img/medium.jpg");
        assertThat(s.backdropPath()).isEqualTo("https://img/original.jpg");
        assertThat(s.voteAverage()).isEqualTo(8.9);
        assertThat(s.genres()).containsExactly("Drama", "Adventure", "Fantasy");
    }

    @Test
    void handlesNullImageAndRating() throws Exception {
        var node = json.readTree("""
            {"id": 1, "name": "No Art", "genres": [], "image": null, "rating": {"average": null}}
            """);

        MovieSummary s = mapper.toSummary(node);

        assertThat(s.posterPath()).isNull();
        assertThat(s.backdropPath()).isNull();
        assertThat(s.voteAverage()).isNull();
    }

    @Test
    void buildsDetailWithCastNetworkAndSeasonStats() throws Exception {
        var node = json.readTree("""
            {
              "id": 82, "name": "Game of Thrones", "status": "Ended",
              "averageRuntime": 61, "premiered": "2011-04-17", "ended": "2019-05-19",
              "rating": {"average": 8.9},
              "genres": ["Drama", "Fantasy"],
              "network": {"name": "HBO"},
              "summary": "<p>Winter is coming.</p>",
              "_embedded": {
                "cast": [
                  {"person": {"id": 14072, "name": "Peter Dinklage", "image": {"medium": "p.jpg"}},
                   "character": {"name": "Tyrion Lannister"}}
                ],
                "episodes": [
                  {"season": 1}, {"season": 1}, {"season": 2}
                ]
              }
            }
            """);

        MovieDetail d = mapper.toDetail(node);

        assertThat(d.title()).isEqualTo("Game of Thrones");
        assertThat(d.network()).isEqualTo("HBO");
        assertThat(d.tagline()).isEqualTo("HBO");
        assertThat(d.runtime()).isEqualTo(61);
        assertThat(d.status()).isEqualTo("Ended");
        assertThat(d.ended()).isEqualTo("2019-05-19");
        assertThat(d.genres()).containsExactly("Drama", "Fantasy");
        assertThat(d.cast()).hasSize(1);
        assertThat(d.cast().get(0).name()).isEqualTo("Peter Dinklage");
        assertThat(d.cast().get(0).character()).isEqualTo("Tyrion Lannister");
        assertThat(d.cast().get(0).profilePath()).isEqualTo("p.jpg");
        assertThat(d.seasons()).isEqualTo(2);
        assertThat(d.episodes()).isEqualTo(3);
        assertThat(d.similar()).isEmpty();
    }

    @Test
    void fallsBackToWebChannelForNetwork() throws Exception {
        var node = json.readTree("""
            {"id": 9, "name": "Stream Show", "genres": [], "network": null,
             "webChannel": {"name": "Netflix"}, "rating": {"average": 7.0},
             "_embedded": {"cast": [], "episodes": []}}
            """);

        MovieDetail d = mapper.toDetail(node);

        assertThat(d.network()).isEqualTo("Netflix");
        assertThat(d.seasons()).isNull();
        assertThat(d.episodes()).isNull();
    }
}
