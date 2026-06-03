import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MovieDetail, MoviePage, SortOption } from '../models/movie.models';

/**
 * Typed gateway to the CineWave backend (which proxies the free TVMaze API).
 */
@Injectable({ providedIn: 'root' })
export class MovieApi {
  private readonly http = inject(HttpClient);
  private readonly base = '/api';

  trending(): Observable<MoviePage> {
    return this.http.get<MoviePage>(`${this.base}/movies/trending`);
  }

  popular(page = 1): Observable<MoviePage> {
    return this.list('popular', page);
  }
  topRated(page = 1): Observable<MoviePage> {
    return this.list('top-rated', page);
  }
  upcoming(page = 1): Observable<MoviePage> {
    return this.list('upcoming', page);
  }
  nowPlaying(page = 1): Observable<MoviePage> {
    return this.list('now-playing', page);
  }

  private list(slug: string, page: number): Observable<MoviePage> {
    return this.http.get<MoviePage>(`${this.base}/movies/${slug}`, {
      params: new HttpParams().set('page', page),
    });
  }

  detail(id: number): Observable<MovieDetail> {
    return this.http.get<MovieDetail>(`${this.base}/movies/${id}`);
  }

  search(query: string): Observable<MoviePage> {
    return this.http.get<MoviePage>(`${this.base}/search`, {
      params: new HttpParams().set('q', query),
    });
  }

  discover(genre: string | null, sort: SortOption, page = 1): Observable<MoviePage> {
    let params = new HttpParams().set('sort', sort).set('page', page);
    if (genre) params = params.set('genre', genre);
    return this.http.get<MoviePage>(`${this.base}/discover`, { params });
  }

  genres(): Observable<string[]> {
    return this.http.get<string[]>(`${this.base}/genres`);
  }
}
