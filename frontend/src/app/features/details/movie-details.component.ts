import { Component, OnInit, inject, input, signal } from '@angular/core';
import { MovieApi } from '../../core/api/movie.api';
import { ImageService } from '../../core/api/image.service';
import { FavoritesService } from '../../core/favorites/favorites.service';
import { MovieDetail } from '../../core/models/movie.models';
import { MovieRowComponent } from '../../shared/components/movie-row.component';
import { RatingRingComponent } from '../../shared/components/rating-ring.component';
import { I18nService } from '../../core/i18n/i18n.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [MovieRowComponent, RatingRingComponent, TranslatePipe],
  template: `
    @if (movie(); as m) {
      <article class="page">
        <!-- Backdrop hero -->
        <div class="hero">
          @if (backdrop(m)) { <div class="bg" [style.background-image]="backdrop(m)"></div> }
          <div class="scrim"></div>
        </div>

        <div class="container body">
          <div class="poster">
            @if (poster(m)) { <img [src]="poster(m)" [alt]="m.title" /> }
            @else { <div class="noimg">{{ m.title }}</div> }
          </div>

          <div class="info">
            <h1 class="display title">{{ m.title }}</h1>
            @if (m.tagline) { <p class="tagline">{{ m.tagline }}</p> }

            <div class="facts">
              <app-rating-ring [value]="m.voteAverage" [size]="52" />
              <div class="facts-text">
                <span>{{ m.releaseDate ? m.releaseDate.slice(0,4) : '—' }}</span>
                @if (m.runtime) { <span>· {{ runtime(m.runtime) }}</span> }
                @if (m.status) { <span>· {{ m.status }}</span> }
              </div>
            </div>

            <div class="genres">
              @for (g of m.genres; track g) { <span class="chip">{{ g }}</span> }
            </div>

            <p class="overview">{{ m.overview || ('details.synopsis_none' | t) }}</p>

            <div class="cta">
              <button class="btn btn-primary" (click)="toggleFav(m)">
                {{ favorites.isFavorite(m.id) ? ('details.added' | t) : ('details.add' | t) }}
              </button>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <section class="container stats">
          @if (m.network) { <div class="stat"><span class="k">{{ 'details.network' | t }}</span><span class="v">{{ m.network }}</span></div> }
          @if (m.status) { <div class="stat"><span class="k">{{ 'details.status' | t }}</span><span class="v">{{ m.status }}</span></div> }
          @if (m.seasons) { <div class="stat"><span class="k">{{ 'details.seasons' | t }}</span><span class="v">{{ m.seasons }}</span></div> }
          @if (m.episodes) { <div class="stat"><span class="k">{{ 'details.episodes' | t }}</span><span class="v">{{ m.episodes }}</span></div> }
          <div class="stat"><span class="k">{{ 'details.aired' | t }}</span><span class="v">{{ aired(m) }}</span></div>
        </section>

        <!-- Cast -->
        @if (m.cast.length) {
          <section class="container cast-section">
            <h2 class="section-title">{{ 'details.cast' | t }}</h2>
            <div class="cast-rail">
              @for (c of m.cast; track c.id) {
                <figure class="cast">
                  @if (profile(c.profilePath)) {
                    <img [src]="profile(c.profilePath)" [alt]="c.name" loading="lazy" />
                  } @else { <div class="avatar">{{ initials(c.name) }}</div> }
                  <figcaption>
                    <strong>{{ c.name }}</strong>
                    <span>{{ c.character }}</span>
                  </figcaption>
                </figure>
              }
            </div>
          </section>
        }

        <!-- Similar -->
        @if (m.similar.length) {
          <app-movie-row [title]="'details.more' | t" [movies]="m.similar" />
        }
      </article>
    } @else {
      <div class="container loading">
        <div class="skeleton sk-poster"></div>
        <div class="sk-lines">
          <div class="skeleton l1"></div><div class="skeleton l2"></div><div class="skeleton l3"></div>
        </div>
      </div>
    }
  `,
  styles: [`
    .hero { position: relative; height: min(60vh, 560px); margin-top: calc(var(--nav-h) * -1); }
    .bg { position: absolute; inset: 0; background-size: cover; background-position: center 18%; }
    .scrim {
      position: absolute; inset: 0;
      background: linear-gradient(0deg, var(--bg) 4%, rgba(7,7,11,0.5) 50%, rgba(7,7,11,0.7));
    }
    .body { position: relative; margin-top: -220px; display: flex; gap: 38px; align-items: flex-end; }
    .poster {
      flex: 0 0 260px; width: 260px; aspect-ratio: 2/3; border-radius: var(--radius-lg);
      overflow: hidden; box-shadow: var(--shadow); border: 1px solid var(--border-strong);
    }
    .poster img { width: 100%; height: 100%; object-fit: cover; }
    .noimg { width: 100%; height: 100%; display: grid; place-items: center; background: var(--surface); padding: 20px; text-align: center; }
    .info { flex: 1; padding-bottom: 8px; }
    .title { font-size: clamp(34px, 5vw, 64px); color: var(--on-media); }
    .tagline { color: var(--gold); font-weight: 600; letter-spacing: 0.04em; margin: 8px 0 0; text-transform: uppercase; font-size: 13px; }
    .facts { display: flex; align-items: center; gap: 16px; margin: 18px 0; }
    .facts-text { color: var(--on-media-muted); display: flex; gap: 8px; flex-wrap: wrap; font-weight: 500; }
    .genres { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; }
    .genres .chip { cursor: default; }
    .overview { color: var(--text-muted); line-height: 1.7; max-width: 760px; }
    .cta { display: flex; gap: 14px; margin-top: 24px; flex-wrap: wrap; }

    .stats {
      display: flex; flex-wrap: wrap; gap: 14px; margin-top: 36px;
    }
    .stat {
      display: flex; flex-direction: column; gap: 4px; min-width: 120px;
      padding: 14px 18px; border-radius: var(--radius);
      background: var(--surface); border: 1px solid var(--border);
    }
    .stat .k { font-size: 12px; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.06em; }
    .stat .v { font-size: 16px; font-weight: 600; }

    .cast-section { margin-top: 56px; }
    .cast-rail { display: flex; gap: 16px; overflow-x: auto; padding-bottom: 10px; }
    .cast-rail::-webkit-scrollbar { height: 6px; }
    .cast { flex: 0 0 auto; width: 124px; margin: 0; }
    .cast img, .avatar {
      width: 124px; height: 168px; border-radius: var(--radius); object-fit: cover;
      border: 1px solid var(--border); display: block;
    }
    .avatar {
      display: grid; place-items: center; font-size: 26px; font-weight: 700;
      color: var(--text-faint); background: linear-gradient(160deg, var(--surface), var(--surface-2));
    }
    figcaption { margin-top: 8px; display: flex; flex-direction: column; }
    figcaption strong { font-size: 14px; }
    figcaption span { font-size: 12.5px; color: var(--text-faint); }

    .loading { display: flex; gap: 38px; padding-top: 140px; }
    .sk-poster { width: 260px; aspect-ratio: 2/3; border-radius: var(--radius-lg); }
    .sk-lines { flex: 1; display: flex; flex-direction: column; gap: 14px; padding-top: 20px; }
    .l1 { height: 48px; width: 60%; border-radius: 8px; }
    .l2 { height: 20px; width: 40%; border-radius: 8px; }
    .l3 { height: 120px; width: 90%; border-radius: 8px; }
    @media (max-width: 760px) {
      .body { flex-direction: column; align-items: stretch; margin-top: -140px; }
      .poster { width: 160px; }
    }
  `],
})
export class MovieDetailsComponent implements OnInit {
  readonly id = input.required<string>();
  private readonly api = inject(MovieApi);
  private readonly images = inject(ImageService);
  private readonly i18n = inject(I18nService);
  protected readonly favorites = inject(FavoritesService);

  protected readonly movie = signal<MovieDetail | null>(null);

  ngOnInit(): void {
    this.movie.set(null);
    this.api.detail(Number(this.id())).subscribe((m) => this.movie.set(m));
  }

  backdrop(m: MovieDetail): string {
    const u = this.images.backdrop(m.backdropPath);
    return u ? `url('${u}')` : '';
  }
  poster(m: MovieDetail): string | null {
    return this.images.poster(m.posterPath);
  }
  profile(path: string | null): string | null {
    return this.images.profile(path);
  }
  runtime(min: number): string {
    return min >= 60 ? `${Math.floor(min / 60)}h ${min % 60}m` : `${min}m`;
  }
  aired(m: MovieDetail): string {
    const from = m.releaseDate ? m.releaseDate.slice(0, 4) : '—';
    const to = m.ended ? m.ended.slice(0, 4) : this.i18n.t('details.present');
    return from === to ? from : `${from} – ${to}`;
  }
  initials(name: string): string {
    return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
  }
  toggleFav(m: MovieDetail): void {
    this.favorites.toggle({
      id: m.id, title: m.title, overview: m.overview, posterPath: m.posterPath,
      backdropPath: m.backdropPath, releaseDate: m.releaseDate, voteAverage: m.voteAverage,
      voteCount: m.voteCount, genres: m.genres,
    });
  }
}
