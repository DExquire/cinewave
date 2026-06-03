import { Component, Input } from '@angular/core';
import { MovieSummary } from '../../core/models/movie.models';
import { MovieCardComponent } from './movie-card.component';

/** Responsive poster grid used by Browse, Search and Favorites. */
@Component({
  selector: 'app-movie-grid',
  standalone: true,
  imports: [MovieCardComponent],
  template: `
    <div class="grid">
      @if (loading) {
        @for (s of skeletons; track $index) { <div class="skeleton sk"></div> }
      } @else {
        @for (m of movies; track m.id) { <app-movie-card [movie]="m" /> }
      }
    </div>
  `,
  styles: [`
    .grid {
      display: grid; gap: 22px 18px;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }
    .sk { aspect-ratio: 2/3; border-radius: var(--radius); }
    @media (min-width: 720px) {
      .grid { grid-template-columns: repeat(auto-fill, minmax(168px, 1fr)); }
    }
  `],
})
export class MovieGridComponent {
  @Input() movies: MovieSummary[] = [];
  @Input() loading = false;
  protected readonly skeletons = Array.from({ length: 12 });
}
