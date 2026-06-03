import { Injectable, signal } from '@angular/core';

export type Theme = 'dark' | 'light';

const KEY = 'cinewave-theme';

/** Theme held in a signal and reflected onto <html data-theme>, persisted in localStorage.
 *  Defaults to dark; all colours are driven by CSS variables (see styles.scss). */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>(this.initial());

  constructor() {
    this.apply(this.theme());
  }

  toggle(): void {
    this.set(this.theme() === 'dark' ? 'light' : 'dark');
  }

  set(t: Theme): void {
    this.theme.set(t);
    try { localStorage.setItem(KEY, t); } catch { /* storage blocked — keep in memory */ }
    this.apply(t);
  }

  private apply(t: Theme): void {
    document.documentElement.dataset['theme'] = t;
  }

  private initial(): Theme {
    try {
      const saved = localStorage.getItem(KEY) as Theme | null;
      if (saved === 'light' || saved === 'dark') return saved;
    } catch { /* ignore */ }
    return 'dark';
  }
}
