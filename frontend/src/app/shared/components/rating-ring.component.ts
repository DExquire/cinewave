import { Component, Input, computed, signal } from '@angular/core';

/** Circular score badge (0–10 → 0–100%), colour-graded by rating. */
@Component({
  selector: 'app-rating-ring',
  standalone: true,
  template: `
    <div class="ring" [style.width.px]="size" [style.height.px]="size">
      <svg [attr.viewBox]="'0 0 36 36'">
        <circle class="track" cx="18" cy="18" r="16" />
        <circle class="bar" cx="18" cy="18" r="16"
                [attr.stroke]="color()"
                [style.stroke-dasharray]="dash()" />
      </svg>
      <span class="num" [style.font-size.px]="size * 0.3">{{ display() }}</span>
    </div>
  `,
  styles: [`
    .ring { position: relative; }
    svg { width: 100%; height: 100%; transform: rotate(-90deg); }
    circle { fill: rgba(8,8,12,0.7); stroke-width: 3; }
    .track { stroke: rgba(255,255,255,0.12); }
    .bar { stroke-linecap: round; transition: stroke-dasharray 0.6s var(--ease); }
    .num {
      position: absolute; inset: 0; display: flex; align-items: center;
      justify-content: center; font-weight: 700; color: #fff;
    }
  `],
})
export class RatingRingComponent {
  @Input() size = 44;
  private readonly _value = signal(0);

  @Input() set value(v: number | null) {
    this._value.set(v ?? 0);
  }

  protected readonly display = computed(() => this._value() ? this._value().toFixed(1) : '—');
  protected readonly dash = computed(() => {
    const pct = Math.max(0, Math.min(10, this._value())) / 10;
    return `${(pct * 100).toFixed(1)} 100`;
  });
  protected readonly color = computed(() => {
    const v = this._value();
    if (v >= 7.5) return '#5ee7a0';
    if (v >= 6) return '#ffc83d';
    if (v > 0) return '#ff5a5f';
    return 'rgba(255,255,255,0.25)';
  });
}
