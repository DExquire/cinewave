export interface MovieSummary {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;   // absolute URL (TVMaze CDN) or null
  backdropPath: string | null; // absolute URL or null
  releaseDate: string | null;
  voteAverage: number | null;
  voteCount: number | null;
  genres: string[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
}

export interface MovieDetail {
  id: number;
  title: string;
  tagline: string | null;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string | null;
  runtime: number | null;
  voteAverage: number | null;
  voteCount: number | null;
  status: string | null;
  genres: string[];
  network: string | null;
  ended: string | null;
  seasons: number | null;
  episodes: number | null;
  cast: CastMember[];
  similar: MovieSummary[];
}

export interface MoviePage {
  page: number;
  totalPages: number;
  totalResults: number;
  results: MovieSummary[];
}

export type SortOption = 'popularity' | 'rating' | 'newest';
