package com.cinewave.client;

import com.cinewave.model.CastMember;
import com.cinewave.model.MovieDetail;
import com.cinewave.model.MovieSummary;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;
import org.springframework.stereotype.Component;

/** Pure transformation layer: TVMaze JSON → CineWave domain records. */
@Component
public class ShowMapper {

    public MovieSummary toSummary(JsonNode n) {
        return new MovieSummary(
                n.path("id").asLong(),
                text(n, "name"),
                stripHtml(nullableText(n, "summary")),
                image(n, "medium"),
                image(n, "original"),
                nullableText(n, "premiered"),
                rating(n),
                null, // TVMaze exposes no vote count
                genres(n)
        );
    }

    public MovieDetail toDetail(JsonNode n) {
        JsonNode embedded = n.path("_embedded");

        // Top-billed cast (cap at 12).
        List<CastMember> cast = new ArrayList<>();
        embedded.path("cast").forEach(c -> {
            JsonNode person = c.path("person");
            cast.add(new CastMember(
                    person.path("id").asLong(),
                    text(person, "name"),
                    text(c.path("character"), "name"),
                    image(person, "medium")
            ));
        });

        // Season / episode counts from embedded episodes.
        int episodeCount = 0;
        Set<Integer> seasonNumbers = new TreeSet<>();
        for (JsonNode ep : embedded.path("episodes")) {
            episodeCount++;
            if (ep.has("season")) seasonNumbers.add(ep.get("season").asInt());
        }

        return new MovieDetail(
                n.path("id").asLong(),
                text(n, "name"),
                tagline(n),
                stripHtml(nullableText(n, "summary")),
                image(n, "medium"),
                image(n, "original"),
                nullableText(n, "premiered"),
                runtime(n),
                rating(n),
                null,
                nullableText(n, "status"),
                genres(n),
                network(n),
                nullableText(n, "ended"),
                seasonNumbers.isEmpty() ? null : seasonNumbers.size(),
                episodeCount == 0 ? null : episodeCount,
                cast.stream().limit(12).toList(),
                List.of() // similar is filled in by ShowService from the catalog
        );
    }

    /* ----------------------------- helpers ----------------------------- */

    private List<String> genres(JsonNode n) {
        List<String> out = new ArrayList<>();
        n.path("genres").forEach(g -> out.add(g.asText()));
        return out;
    }

    private Double rating(JsonNode n) {
        JsonNode avg = n.path("rating").get("average");
        return (avg == null || avg.isNull()) ? null : avg.asDouble();
    }

    private Integer runtime(JsonNode n) {
        JsonNode r = n.get("averageRuntime");
        if (r == null || r.isNull()) r = n.get("runtime");
        return (r == null || r.isNull()) ? null : r.asInt();
    }

    private String network(JsonNode n) {
        String net = nullableText(n.path("network"), "name");
        return net != null ? net : nullableText(n.path("webChannel"), "name");
    }

    private String tagline(JsonNode n) {
        // Use the network as a subtle subtitle when present.
        String net = network(n);
        return net != null ? net : null;
    }

    private String image(JsonNode n, String size) {
        JsonNode img = n.get("image");
        if (img == null || img.isNull()) return null;
        JsonNode v = img.get(size);
        return (v == null || v.isNull()) ? null : v.asText();
    }

    /** Removes HTML tags and collapses whitespace from TVMaze summaries. */
    private String stripHtml(String html) {
        if (html == null) return "";
        return html.replaceAll("<[^>]+>", "")
                .replace("&amp;", "&").replace("&quot;", "\"")
                .replace("&#39;", "'").replace("&apos;", "'")
                .replaceAll("\\s+", " ")
                .trim();
    }

    private static String text(JsonNode n, String field) {
        return n.path(field).asText("");
    }

    private static String nullableText(JsonNode n, String field) {
        JsonNode f = n.get(field);
        return (f == null || f.isNull() || f.asText().isBlank()) ? null : f.asText();
    }
}
