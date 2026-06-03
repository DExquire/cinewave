import { Component, HostListener, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs';
import { FavoritesService } from '../core/favorites/favorites.service';
import { ThemeService } from '../core/theme/theme.service';
import { I18nService } from '../core/i18n/i18n.service';
import { LOCALES, Locale } from '../core/i18n/translations';
import { TranslatePipe } from '../core/i18n/translate.pipe';

/** Glassmorphism top bar that turns solid once the user scrolls past the hero.
 *  Holds the theme toggle and language switcher; collapses into a burger menu
 *  on narrow screens. */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule, TranslatePipe],
  template: `
    <header class="nav" [class.scrolled]="scrolled()" [class.open]="menuOpen()">
      <div class="container inner">
        <a routerLink="/" class="brand" aria-label="CineWave home" (click)="closeMenu()">
          <span class="logo"></span>
          <span class="word display">CINE<span class="text-gradient">WAVE</span></span>
        </a>

        <button
          class="burger"
          type="button"
          (click)="toggleMenu()"
          [attr.aria-expanded]="menuOpen()"
          aria-controls="primary-nav"
          [attr.aria-label]="'nav.menu' | t"
        >
          <span></span><span></span><span></span>
        </button>

        <div class="menu" id="primary-nav">
          <nav class="links">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="closeMenu()">{{ 'nav.home' | t }}</a>
            <a routerLink="/browse" routerLinkActive="active" (click)="closeMenu()">{{ 'nav.browse' | t }}</a>
            <a routerLink="/favorites" routerLinkActive="active" (click)="closeMenu()">
              {{ 'nav.mylist' | t }}
              @if (favorites.count() > 0) { <em class="badge">{{ favorites.count() }}</em> }
            </a>
          </nav>

          <form class="search" (submit)="submit($event)">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path fill="currentColor" d="M21 20l-5.6-5.6a7 7 0 1 0-1.4 1.4L20 21zM5 10a5 5 0 1 1 10 0 5 5 0 0 1-10 0z"/>
            </svg>
            <input [(ngModel)]="query" name="q" [placeholder]="'nav.search' | t" autocomplete="off" />
          </form>

          <div class="tools">
            <button
              class="icon-btn"
              type="button"
              (click)="theme.toggle()"
              [attr.aria-label]="(theme.theme() === 'dark' ? 'nav.theme_to_light' : 'nav.theme_to_dark') | t"
              [title]="(theme.theme() === 'dark' ? 'nav.theme_to_light' : 'nav.theme_to_dark') | t"
            >
              @if (theme.theme() === 'dark') {
                <!-- sun -->
                <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <circle cx="12" cy="12" r="4.2"/>
                  <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/>
                </svg>
              } @else {
                <!-- moon -->
                <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor">
                  <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8z"/>
                </svg>
              }
            </button>

            <select
              class="lang"
              [value]="i18n.locale()"
              (change)="onLang($event)"
              [attr.aria-label]="'nav.language' | t"
            >
              @for (l of locales; track l.code) {
                <option [value]="l.code">{{ l.label }}</option>
              }
            </select>
          </div>
        </div>
      </div>

      <button class="scrim-close" type="button" tabindex="-1" aria-hidden="true" (click)="closeMenu()"></button>
    </header>
  `,
  styles: [`
    .nav {
      position: sticky; top: 0; z-index: 50;
      transition: background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s;
      border-bottom: 1px solid transparent;
    }
    /* Cinematic top scrim — keeps the transparent bar's (light) controls
       readable over hero imagery, and identical in both themes. */
    .nav::before {
      content: ''; position: absolute; inset: 0; pointer-events: none;
      background: linear-gradient(180deg, rgba(5,5,10,0.5), rgba(5,5,10,0.12) 62%, transparent);
      transition: opacity 0.3s ease;
    }
    .nav.scrolled, .nav.open {
      background: var(--nav-bg);
      backdrop-filter: blur(16px) saturate(160%);
      border-bottom-color: var(--border);
    }
    /* Once the bar has a solid (theme-coloured) background, drop the scrim. */
    .nav.scrolled::before, .nav.open::before { opacity: 0; }
    .inner { position: relative; z-index: 1; height: var(--nav-h); display: flex; align-items: center; gap: 22px; }
    .brand { display: flex; align-items: center; gap: 10px; }
    .logo {
      width: 16px; height: 16px; border-radius: 4px;
      background: var(--accent-grad);
      box-shadow: 0 0 18px rgba(255, 90, 95, 0.6);
    }
    .word { font-size: 26px; letter-spacing: 1px; color: var(--on-media); }

    .menu { display: contents; }

    .links { display: flex; gap: 6px; margin-left: 8px; }
    .links a {
      position: relative; padding: 8px 14px; border-radius: 99px;
      color: var(--on-media-muted); font-weight: 500; font-size: 15px;
      transition: color 0.2s, background 0.2s;
    }
    .links a:hover { color: var(--on-media); }
    .links a.active { color: var(--on-media); background: rgba(255,255,255,0.16); }
    .badge {
      font-style: normal; font-size: 11px; font-weight: 700;
      margin-left: 6px; padding: 1px 7px; border-radius: 99px;
      background: var(--accent-grad); color: #16080a;
    }
    .search {
      margin-left: auto; display: flex; align-items: center; gap: 8px;
      padding: 9px 16px; border-radius: 99px;
      background: var(--surface); border: 1px solid var(--border);
      color: var(--text-faint); transition: border-color 0.2s, box-shadow 0.2s;
      min-width: 200px;
    }
    .search:focus-within {
      border-color: var(--border-strong);
      box-shadow: 0 0 0 3px rgba(255, 200, 61, 0.12);
    }
    .search input {
      border: none; background: transparent; color: var(--text);
      font: inherit; font-size: 14px; width: 100%; outline: none;
    }
    .search input::placeholder { color: var(--text-faint); }

    /* Theme toggle + language switcher — light over the transparent bar */
    .tools { display: flex; align-items: center; gap: 10px; }
    .icon-btn {
      width: 40px; height: 40px; display: grid; place-items: center; padding: 0;
      border-radius: 12px; cursor: pointer; color: var(--on-media);
      background: rgba(255,255,255,0.10);
      border: 1px solid rgba(255,255,255,0.22);
      transition: background 0.2s, color 0.2s, border-color 0.2s;
    }
    .icon-btn:hover { background: rgba(255,255,255,0.20); color: var(--gold); }
    .lang {
      appearance: none; -webkit-appearance: none;
      font: inherit; font-size: 13px; font-weight: 600; letter-spacing: 0.04em;
      color: var(--on-media); cursor: pointer; height: 40px;
      background: rgba(255,255,255,0.10);
      border: 1px solid rgba(255,255,255,0.22); border-radius: 12px;
      padding: 0 12px;
      transition: background 0.2s, color 0.2s, border-color 0.2s;
    }
    .lang:hover { background: rgba(255,255,255,0.20); }
    .lang option { color: #16161c; background: #fff; }

    /* Burger button — hidden on desktop */
    .burger {
      display: none; margin-left: auto;
      flex-direction: column; align-items: center; justify-content: center;
      gap: 5px; width: 42px; height: 42px; padding: 0;
      border: 1px solid rgba(255,255,255,0.22); border-radius: 12px;
      background: rgba(255,255,255,0.10); cursor: pointer;
    }
    .burger span {
      display: block; width: 20px; height: 2px; border-radius: 2px;
      background: var(--on-media); transition: transform 0.28s var(--ease), opacity 0.18s, background 0.2s;
    }

    /* When the bar has a solid (theme) background, switch controls to theme colours. */
    .nav.scrolled .word, .nav.open .word { color: var(--text); }
    .nav.scrolled .links a, .nav.open .links a { color: var(--text-muted); }
    .nav.scrolled .links a:hover, .nav.open .links a:hover,
    .nav.scrolled .links a.active, .nav.open .links a.active { color: var(--text); }
    .nav.scrolled .links a.active, .nav.open .links a.active { background: color-mix(in srgb, var(--text) 8%, transparent); }
    .nav.scrolled .icon-btn, .nav.open .icon-btn,
    .nav.scrolled .lang, .nav.open .lang {
      color: var(--text);
      background: color-mix(in srgb, var(--text) 6%, transparent);
      border-color: var(--border-strong);
    }
    .nav.scrolled .icon-btn:hover, .nav.open .icon-btn:hover { color: var(--gold); }
    .nav.scrolled .burger span, .nav.open .burger span { background: var(--text); }
    .nav.open .burger span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .nav.open .burger span:nth-child(2) { opacity: 0; }
    .nav.open .burger span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

    .scrim-close { display: none; }

    /* ── Mobile: collapse links + search + tools into a dropdown panel ── */
    @media (max-width: 760px) {
      .burger { display: inline-flex; }

      .menu {
        display: flex; flex-direction: column; gap: 12px;
        position: absolute; top: 100%; left: 0; right: 0;
        padding: 14px clamp(16px, 4vw, 40px) 20px;
        background: var(--panel-bg);
        backdrop-filter: blur(16px) saturate(160%);
        border-bottom: 1px solid var(--border);
        box-shadow: var(--shadow);
        transform: translateY(-10px); opacity: 0; visibility: hidden; z-index: 2;
        transition: transform 0.24s var(--ease), opacity 0.24s var(--ease), visibility 0.24s;
      }
      .nav.open .menu { transform: translateY(0); opacity: 1; visibility: visible; }

      .links { flex-direction: column; gap: 4px; margin-left: 0; }
      .links a { padding: 12px 14px; font-size: 16px; }

      .search { margin-left: 0; width: 100%; min-width: 0; }
      .tools { margin-top: 2px; justify-content: flex-start; }
      .lang { width: auto; min-width: 72px; }

      .nav.open .scrim-close {
        display: block; position: fixed; inset: var(--nav-h) 0 0 0;
        z-index: 1; background: transparent; border: none; cursor: default;
      }
    }
  `],
})
export class NavbarComponent {
  protected readonly favorites = inject(FavoritesService);
  protected readonly theme = inject(ThemeService);
  protected readonly i18n = inject(I18nService);
  private readonly router = inject(Router);

  protected readonly locales = LOCALES;
  protected query = '';
  protected readonly scrolled = signal(false);
  protected readonly menuOpen = signal(false);

  constructor() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.menuOpen.set(false));
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 24);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.menuOpen.set(false);
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 760 && this.menuOpen()) this.menuOpen.set(false);
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  onLang(e: Event): void {
    this.i18n.setLocale((e.target as HTMLSelectElement).value as Locale);
  }

  submit(e: Event): void {
    e.preventDefault();
    const q = this.query.trim();
    if (q) {
      this.menuOpen.set(false);
      this.router.navigate(['/search'], { queryParams: { q } });
    }
  }
}
