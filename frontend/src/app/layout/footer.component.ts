import { Component } from '@angular/core';
import { TranslatePipe } from '../core/i18n/translate.pipe';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <footer>
      <div class="container row">
        <span class="brand display">CINE<span class="text-gradient">WAVE</span></span>
        <span class="muted">{{ 'footer.data' | t }}</span>
        <span class="muted">{{ 'footer.built' | t }}</span>
      </div>
    </footer>
  `,
  styles: [`
    footer { margin-top: 80px; border-top: 1px solid var(--border); padding: 30px 0; }
    .row { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
    .brand { font-size: 22px; letter-spacing: 1px; }
    .muted { color: var(--text-faint); font-size: 13px; }
    .muted:last-child { margin-left: auto; }
  `],
})
export class FooterComponent {}
