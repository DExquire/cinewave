import { Injectable, signal } from '@angular/core';
import { Locale, TRANSLATIONS } from './translations';

const KEY = 'cinewave-lang';

/** Lightweight runtime i18n — locale held in a signal, persisted in localStorage.
 *  No build-time setup, no extra dependencies; language switches instantly. */
@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly locale = signal<Locale>(this.initial());

  constructor() {
    this.apply(this.locale());
  }

  setLocale(l: Locale): void {
    this.locale.set(l);
    try { localStorage.setItem(KEY, l); } catch { /* storage blocked — keep in memory */ }
    this.apply(l);
  }

  /** Translate a key for the active locale, falling back to English then the key itself. */
  t(key: string): string {
    const l = this.locale();
    return TRANSLATIONS[l][key] ?? TRANSLATIONS.en[key] ?? key;
  }

  private apply(l: Locale): void {
    document.documentElement.lang = l;
  }

  private initial(): Locale {
    try {
      const saved = localStorage.getItem(KEY) as Locale | null;
      if (saved && saved in TRANSLATIONS) return saved;
    } catch { /* ignore */ }
    return 'en';
  }
}
