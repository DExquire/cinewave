import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoritesService } from '../../core/favorites/favorites.service';
import { MovieGridComponent } from '../../shared/components/movie-grid.component';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [RouterLink, MovieGridComponent, TranslatePipe],
  template: `
    <div class="container page">
      <h1 class="title">{{ 'fav.title' | t }} <span class="count">{{ favorites.count() }}</span></h1>

      @if (favorites.items().length) {
        <app-movie-grid [movies]="favorites.items()" />
      } @else {
        <div class="empty">
          <div class="art">♥</div>
          <h2>{{ 'fav.empty_title' | t }}</h2>
          <p>{{ 'fav.empty_text' | t }}</p>
          <a class="btn btn-primary" routerLink="/browse">{{ 'fav.browse' | t }}</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .page { padding: calc(var(--nav-h) + 30px) 0 0; min-height: 60vh; }
    .title { font-size: clamp(28px, 4vw, 44px); display: flex; align-items: center; gap: 12px; margin-bottom: 28px; }
    .count {
      font-size: 16px; color: var(--text-faint); font-weight: 600;
      background: var(--surface); border: 1px solid var(--border); padding: 2px 12px; border-radius: 99px;
    }
    .empty { text-align: center; padding: 80px 0; display: flex; flex-direction: column; align-items: center; gap: 10px; }
    .art {
      font-size: 64px; width: 120px; height: 120px; display: grid; place-items: center;
      border-radius: 50%; background: var(--surface); border: 1px solid var(--border);
      color: var(--coral); margin-bottom: 8px;
    }
    .empty p { color: var(--text-faint); max-width: 360px; margin: 0 0 18px; }
  `],
})
export class FavoritesComponent {
  protected readonly favorites = inject(FavoritesService);
}
