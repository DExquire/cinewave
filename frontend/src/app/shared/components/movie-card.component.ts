import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ImageService } from '../../core/api/image.service';
import { FavoritesService } from '../../core/favorites/favorites.service';
import { MovieSummary } from '../../core/models/movie.models';
import { RatingRingComponent } from './rating-ring.component';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

/** Poster card with hover reveal, rating ring and a watchlist toggle. */
@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [RouterLink, RatingRingComponent, TranslatePipe],
  template: `
    <div class="card">
      <a [routerLink]="['/movie', movie.id]" class="poster">
        @if (poster()) {
          <img [src]="poster()" [alt]="movie.title" loading="lazy" />
        } @else {
          <div class="noimg"><span>{{ movie.title }}</span></div>
        }
        <div class="overlay">
          <p class="ov">{{ movie.overview || ('details.synopsis_none' | t) }}</p>
        </div>
        <button class="fav" [class.on]="isFav()" (click)="toggle($event)"
                [attr.aria-label]="(isFav() ? 'card.remove' : 'card.add') | t">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path [attr.fill]="isFav() ? '#ff5a5f' : 'none'" stroke="currentColor" stroke-width="2"
              d="M12 21s-7.5-4.6-9.6-9A4.7 4.7 0 0 1 12 6.6 4.7 4.7 0 0 1 21.6 12c-2.1 4.4-9.6 9-9.6 9z"/>
          </svg>
        </button>
      </a>
      <div class="meta">
        <a [routerLink]="['/movie', movie.id]" class="title" [title]="movie.title">{{ movie.title }}</a>
        <div class="sub">
          <app-rating-ring [value]="movie.voteAverage" [size]="34" />
          <span class="year">{{ year() }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card { width: 100%; }
    .poster {
      position: relative; display: block; aspect-ratio: 2 / 3;
      border-radius: var(--radius); overflow: hidden; background: var(--surface);
      border: 1px solid var(--border);
      transition: transform 0.35s var(--ease), box-shadow 0.35s var(--ease), border-color 0.35s;
    }
    .poster img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .card:hover .poster {
      transform: translateY(-6px) scale(1.02);
      box-shadow: var(--shadow-glow); border-color: var(--border-strong);
    }
    .noimg {
      width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
      padding: 16px; text-align: center; color: var(--text-faint);
      background: linear-gradient(160deg, var(--surface), var(--surface-2));
      font-weight: 600;
    }
    .overlay {
      position: absolute; inset: 0; padding: 14px;
      display: flex; align-items: flex-end;
      background: linear-gradient(transparent 40%, rgba(7,7,11,0.92));
      opacity: 0; transition: opacity 0.35s var(--ease);
    }
    .card:hover .overlay { opacity: 1; }
    .ov {
      margin: 0; font-size: 12.5px; line-height: 1.45; color: var(--text-muted);
      display: -webkit-box; -webkit-line-clamp: 5; -webkit-box-orient: vertical; overflow: hidden;
    }
    .fav {
      position: absolute; top: 10px; right: 10px;
      width: 36px; height: 36px; border-radius: 50%;
      display: grid; place-items: center; cursor: pointer;
      color: #fff; background: rgba(8,8,12,0.55);
      border: 1px solid var(--border-strong); backdrop-filter: blur(6px);
      opacity: 0; transform: scale(0.8); transition: all 0.25s var(--ease);
    }
    .card:hover .fav, .fav.on { opacity: 1; transform: scale(1); }
    .fav:hover { background: rgba(8,8,12,0.8); }
    .fav.on { color: #ff5a5f; }
    .meta { padding: 10px 2px 0; }
    .title {
      display: block; font-weight: 600; font-size: 14.5px; color: var(--text);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .title:hover { color: var(--gold); }
    .sub { display: flex; align-items: center; gap: 10px; margin-top: 6px; }
    .year { color: var(--text-faint); font-size: 13px; }
  `],
})
export class MovieCardComponent {
  @Input({ required: true }) movie!: MovieSummary;
  private readonly images = inject(ImageService);
  private readonly favorites = inject(FavoritesService);

  poster(): string | null {
    return this.images.poster(this.movie.posterPath, 'w500');
  }
  year(): string {
    return this.movie.releaseDate ? this.movie.releaseDate.slice(0, 4) : '—';
  }
  isFav(): boolean {
    return this.favorites.isFavorite(this.movie.id);
  }
  toggle(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    this.favorites.toggle(this.movie);
  }
}
