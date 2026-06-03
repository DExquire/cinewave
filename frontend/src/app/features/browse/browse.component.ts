import { Component, OnInit, inject, signal } from '@angular/core';
import { MovieApi } from '../../core/api/movie.api';
import { MovieSummary, SortOption } from '../../core/models/movie.models';
import { MovieGridComponent } from '../../shared/components/movie-grid.component';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [MovieGridComponent, TranslatePipe],
  template: `
    <div class="container page">
      <header class="head">
        <h1 class="section-title">{{ 'browse.title' | t }}</h1>
        <div class="sorts">
          @for (s of sorts; track s.value) {
            <button class="chip" [class.active]="sort() === s.value" (click)="setSort(s.value)">
              {{ s.label | t }}
            </button>
          }
        </div>
      </header>

      <div class="genres">
        <button class="chip" [class.active]="genre() === null" (click)="setGenre(null)">{{ 'browse.all' | t }}</button>
        @for (g of genres(); track g) {
          <button class="chip" [class.active]="genre() === g" (click)="setGenre(g)">{{ g }}</button>
        }
      </div>

      <app-movie-grid [movies]="movies()" [loading]="loading() && !movies().length" />

      @if (!loading() && !movies().length) {
        <p class="empty">{{ 'browse.empty' | t }}</p>
      }

      @if (page() < totalPages()) {
        <div class="more">
          <button class="btn btn-ghost" (click)="loadMore()" [disabled]="loading()">
            {{ loading() ? ('browse.loading' | t) : ('browse.more' | t) }}
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .page { padding: calc(var(--nav-h) + 30px) 0 0; }
    .head { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 16px; }
    .sorts { display: flex; gap: 8px; }
    .genres { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px; }
    .empty { color: var(--text-faint); padding: 60px 0; text-align: center; }
    .more { display: flex; justify-content: center; margin: 40px 0; }
  `],
})
export class BrowseComponent implements OnInit {
  private readonly api = inject(MovieApi);

  protected readonly genres = signal<string[]>([]);
  protected readonly movies = signal<MovieSummary[]>([]);
  protected readonly genre = signal<string | null>(null);
  protected readonly sort = signal<SortOption>('popularity');
  protected readonly page = signal(1);
  protected readonly totalPages = signal(1);
  protected readonly loading = signal(false);

  protected readonly sorts: { value: SortOption; label: string }[] = [
    { value: 'popularity', label: 'browse.popular' },
    { value: 'rating', label: 'browse.toprated' },
    { value: 'newest', label: 'browse.newest' },
  ];

  ngOnInit(): void {
    this.api.genres().subscribe((g) => this.genres.set(g));
    this.fetch(true);
  }

  setGenre(g: string | null): void {
    this.genre.set(g);
    this.fetch(true);
  }
  setSort(s: SortOption): void {
    this.sort.set(s);
    this.fetch(true);
  }
  loadMore(): void {
    this.page.update((p) => p + 1);
    this.fetch(false);
  }

  private fetch(reset: boolean): void {
    if (reset) {
      this.page.set(1);
      this.movies.set([]);
    }
    this.loading.set(true);
    this.api.discover(this.genre(), this.sort(), this.page()).subscribe({
      next: (p) => {
        this.movies.update((cur) => (reset ? p.results : [...cur, ...p.results]));
        this.totalPages.set(p.totalPages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
