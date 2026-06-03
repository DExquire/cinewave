import { Injectable, computed, signal } from '@angular/core';
import { MovieSummary } from '../models/movie.models';

const STORAGE_KEY = 'cinewave:favorites';

/**
 * Client-side watchlist persisted to localStorage. Exposed as signals so any component
 * reacts instantly when a movie is added or removed.
 */
@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly _items = signal<MovieSummary[]>(this.read());

  readonly items = this._items.asReadonly();
  readonly count = computed(() => this._items().length);
  readonly ids = computed(() => new Set(this._items().map((m) => m.id)));

  isFavorite(id: number): boolean {
    return this.ids().has(id);
  }

  toggle(movie: MovieSummary): void {
    const exists = this.isFavorite(movie.id);
    const next = exists
      ? this._items().filter((m) => m.id !== movie.id)
      : [this.slim(movie), ...this._items()];
    this._items.set(next);
    this.persist(next);
  }

  remove(id: number): void {
    const next = this._items().filter((m) => m.id !== id);
    this._items.set(next);
    this.persist(next);
  }

  /** Keep only the fields a card needs, so storage stays tiny. */
  private slim(m: MovieSummary): MovieSummary {
    return {
      id: m.id, title: m.title, overview: m.overview,
      posterPath: m.posterPath, backdropPath: m.backdropPath,
      releaseDate: m.releaseDate, voteAverage: m.voteAverage,
      voteCount: m.voteCount, genres: m.genres ?? [],
    };
  }

  private read(): MovieSummary[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as MovieSummary[]) : [];
    } catch {
      return [];
    }
  }

  private persist(items: MovieSummary[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage full / unavailable — ignore */
    }
  }
}
