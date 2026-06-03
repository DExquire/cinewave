import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MovieApi } from '../../core/api/movie.api';
import { ImageService } from '../../core/api/image.service';
import { FavoritesService } from '../../core/favorites/favorites.service';
import { MovieSummary } from '../../core/models/movie.models';
import { MovieRowComponent } from '../../shared/components/movie-row.component';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MovieRowComponent, TranslatePipe],
  template: `
    <!-- HERO -->
    <section class="hero" [class.ready]="featured().length > 0">
      @if (current(); as f) {
        <div class="bg" [style.background-image]="bgUrl(f)"></div>
        <div class="scrim"></div>
        <div class="container content">
          <span class="kicker">★ {{ 'home.kicker' | t }}</span>
          <h1 class="display title">{{ f.title }}</h1>
          <div class="facts">
            <span class="score">{{ f.voteAverage ? f.voteAverage.toFixed(1) : '—' }}</span>
            <span>{{ f.releaseDate ? f.releaseDate.slice(0,4) : '' }}</span>
          </div>
          <p class="overview">{{ f.overview }}</p>
          <div class="cta">
            <a class="btn btn-primary" [routerLink]="['/movie', f.id]">
              <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>
              {{ 'home.view' | t }}
            </a>
            <button class="btn btn-ghost" (click)="toggleFav(f)">
              {{ favorites.isFavorite(f.id) ? ('home.added' | t) : ('home.add' | t) }}
            </button>
          </div>
          <div class="dots">
            @for (m of featured(); track m.id; let i = $index) {
              <button class="dot" [class.on]="i === index()" (click)="go(i)"
                      [attr.aria-label]="'Featured ' + (i + 1)"></button>
            }
          </div>
        </div>
      } @else {
        <div class="hero-skel skeleton"></div>
      }
    </section>

    <!-- ROWS -->
    <app-movie-row [title]="'home.row.trending' | t" [movies]="trending()" [loading]="!trending().length" />
    <app-movie-row [title]="'home.row.classics' | t" [movies]="popular()" [loading]="!popular().length" />
    <app-movie-row [title]="'home.row.toprated' | t" [movies]="topRated()" [loading]="!topRated().length" />
    <app-movie-row [title]="'home.row.premiered' | t" [movies]="upcoming()" [loading]="!upcoming().length" />
    <app-movie-row [title]="'home.row.airing' | t" [movies]="nowPlaying()" [loading]="!nowPlaying().length" />
  `,
  styles: [`
    .hero {
      position: relative; min-height: min(86vh, 760px);
      display: flex; align-items: flex-end; margin-bottom: 8px;
      margin-top: calc(var(--nav-h) * -1);
      overflow: hidden;
    }
    .bg {
      position: absolute; inset: 0; background-size: cover; background-position: center 18%;
      animation: kenburns 18s ease-out infinite alternate;
    }
    @keyframes kenburns { from { transform: scale(1.04); } to { transform: scale(1.12); } }
    .scrim {
      position: absolute; inset: 0;
      background:
        linear-gradient(180deg, rgba(7,7,11,0.85) 0%, rgba(7,7,11,0.4) 14%, transparent 32%),
        linear-gradient(90deg, rgba(7,7,11,0.92) 0%, rgba(7,7,11,0.55) 45%, transparent 75%),
        linear-gradient(0deg, var(--bg) 0%, var(--bg) 10%, rgba(7,7,11,0.82) 26%, rgba(7,7,11,0.3) 58%, transparent 92%);
    }
    .content { position: relative; padding: 120px 0 56px; max-width: 720px; }
    .kicker {
      display: inline-block; color: var(--gold); font-weight: 600; letter-spacing: 0.12em;
      text-transform: uppercase; font-size: 13px; margin-bottom: 14px;
    }
    .title { font-size: clamp(44px, 8vw, 104px); margin-bottom: 14px; color: var(--on-media); }
    .facts { display: flex; align-items: center; gap: 16px; color: var(--on-media-muted); margin-bottom: 18px; font-weight: 500; }
    .score {
      color: #16080a; background: var(--accent-grad); font-weight: 700;
      padding: 2px 12px; border-radius: 99px;
    }
    .overview {
      color: var(--on-media-muted); font-size: 16px; line-height: 1.6; max-width: 600px;
      display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
    }
    .cta { display: flex; gap: 14px; margin: 26px 0 22px; flex-wrap: wrap; }
    .dots { display: flex; gap: 8px; }
    .dot {
      width: 26px; height: 4px; border-radius: 99px; border: none; cursor: pointer;
      background: rgba(255,255,255,0.22); transition: background 0.3s, width 0.3s;
    }
    .dot.on { background: var(--accent-grad); width: 40px; }
    .hero-skel, .hero .skeleton { position: absolute; inset: 0; }
    @media (max-width: 600px) { .content { padding-top: 100px; } }
  `],
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly api = inject(MovieApi);
  private readonly images = inject(ImageService);
  private readonly router = inject(Router);
  protected readonly favorites = inject(FavoritesService);

  protected readonly trending = signal<MovieSummary[]>([]);
  protected readonly popular = signal<MovieSummary[]>([]);
  protected readonly topRated = signal<MovieSummary[]>([]);
  protected readonly upcoming = signal<MovieSummary[]>([]);
  protected readonly nowPlaying = signal<MovieSummary[]>([]);

  protected readonly index = signal(0);
  protected readonly featured = computed(() =>
    this.trending().filter((m) => m.backdropPath).slice(0, 5),
  );
  protected readonly current = computed(() => this.featured()[this.index()] ?? null);
  private timer?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.api.trending().subscribe((p) => this.trending.set(p.results));
    this.api.popular().subscribe((p) => this.popular.set(p.results));
    this.api.topRated().subscribe((p) => this.topRated.set(p.results));
    this.api.upcoming().subscribe((p) => this.upcoming.set(p.results));
    this.api.nowPlaying().subscribe((p) => this.nowPlaying.set(p.results));
    this.timer = setInterval(() => {
      const n = this.featured().length;
      if (n) this.index.set((this.index() + 1) % n);
    }, 7000);
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  bgUrl(m: MovieSummary): string {
    const url = this.images.backdrop(m.backdropPath, 'original');
    return url ? `url('${url}')` : 'none';
  }
  go(i: number): void {
    this.index.set(i);
  }
  toggleFav(m: MovieSummary): void {
    this.favorites.toggle(m);
  }
}
