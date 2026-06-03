import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { MovieApi } from '../../core/api/movie.api';
import { MovieSummary } from '../../core/models/movie.models';
import { MovieGridComponent } from '../../shared/components/movie-grid.component';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [MovieGridComponent, DecimalPipe, TranslatePipe],
  template: `
    <div class="container page">
      <h1 class="title">
        @if (query()) { {{ 'search.results' | t }} <span class="text-gradient">“{{ query() }}”</span> }
        @else { {{ 'search.title' | t }} }
      </h1>
      @if (total() > 0) { <p class="count">{{ total() | number }} {{ 'search.found' | t }}</p> }

      <app-movie-grid [movies]="movies()" [loading]="loading()" />

      @if (!loading() && query() && !movies().length) {
        <p class="empty">{{ 'search.none' | t }}</p>
      }
      @if (!query()) {
        <p class="empty">{{ 'search.prompt' | t }}</p>
      }
    </div>
  `,
  styles: [`
    .page { padding: calc(var(--nav-h) + 30px) 0 0; min-height: 60vh; }
    .title { font-size: clamp(26px, 4vw, 40px); margin-bottom: 6px; }
    .count { color: var(--text-faint); margin: 0 0 26px; }
    .empty { color: var(--text-faint); padding: 60px 0; text-align: center; }
  `],
})
export class SearchComponent {
  private readonly api = inject(MovieApi);
  private readonly route = inject(ActivatedRoute);

  protected readonly movies = signal<MovieSummary[]>([]);
  protected readonly total = signal(0);
  protected readonly loading = signal(false);
  protected readonly query = toSignal(
    this.route.queryParamMap.pipe(map((p) => p.get('q') ?? '')),
    { initialValue: '' },
  );

  constructor() {
    // React to query-param changes (including navigations from the navbar).
    this.route.queryParamMap.subscribe((p) => this.run(p.get('q') ?? ''));
  }

  private run(q: string): void {
    if (!q.trim()) {
      this.movies.set([]);
      this.total.set(0);
      return;
    }
    this.loading.set(true);
    this.api.search(q).subscribe({
      next: (page) => {
        this.movies.set(page.results);
        this.total.set(page.totalResults);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
