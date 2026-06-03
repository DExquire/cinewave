import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MovieSummary } from '../../core/models/movie.models';
import { MovieCardComponent } from './movie-card.component';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

/** Horizontally-scrolling carousel of movie cards with arrow controls. */
@Component({
  selector: 'app-movie-row',
  standalone: true,
  imports: [MovieCardComponent, TranslatePipe],
  template: `
    <section class="row-wrap">
      <div class="head container">
        <h2 class="section-title">{{ title }}</h2>
      </div>
      <div class="rail-zone">
        <button class="arrow left" (click)="scroll(-1)" [attr.aria-label]="'row.left' | t">‹</button>
        <div class="rail" #rail>
          @if (loading) {
            @for (s of skeletons; track $index) { <div class="cell skeleton sk"></div> }
          } @else {
            @for (m of movies; track m.id) {
              <div class="cell"><app-movie-card [movie]="m" /></div>
            }
          }
        </div>
        <button class="arrow right" (click)="scroll(1)" [attr.aria-label]="'row.right' | t">›</button>
      </div>
    </section>
  `,
  styles: [`
    .row-wrap { margin: 40px 0; }
    .rail-zone { position: relative; }
    .rail {
      display: flex; gap: 16px; overflow-x: auto; scroll-behavior: smooth;
      padding: 4px clamp(16px, 4vw, 40px) 12px; scroll-snap-type: x proximity;
    }
    .rail::-webkit-scrollbar { display: none; }
    .cell { flex: 0 0 auto; width: 168px; scroll-snap-align: start; }
    .sk { aspect-ratio: 2/3; }
    .arrow {
      position: absolute; top: 0; bottom: 12px; z-index: 5; width: 52px;
      border: none; cursor: pointer; color: var(--text); font-size: 34px; line-height: 1;
      background: linear-gradient(90deg, rgba(7,7,11,0.9), transparent);
      opacity: 0; transition: opacity 0.25s;
    }
    .arrow.right { right: 0; background: linear-gradient(270deg, rgba(7,7,11,0.9), transparent); }
    .rail-zone:hover .arrow { opacity: 1; }
    .arrow:hover { color: var(--gold); }
    @media (max-width: 760px) { .arrow { display: none; } .cell { width: 140px; } }
  `],
})
export class MovieRowComponent {
  @Input() title = '';
  @Input() movies: MovieSummary[] = [];
  @Input() loading = false;
  @ViewChild('rail') rail!: ElementRef<HTMLDivElement>;
  protected readonly skeletons = Array.from({ length: 8 });

  scroll(dir: number): void {
    const el = this.rail.nativeElement;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  }
}
