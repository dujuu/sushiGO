import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  template: `
    @if (visible()) {
      <div class="overlay">
        <div class="loader card">{{ message() }}</div>
      </div>
    }
  `,
  styles: [
    `
      .overlay {
        align-items: center;
        background: rgba(5, 5, 7, 0.45);
        display: flex;
        inset: 0;
        justify-content: center;
        position: fixed;
        z-index: 100;
      }

      .loader {
        font-size: 0.85rem;
        font-weight: 600;
        padding: 0.7rem 0.95rem;
      }
    `,
  ],
})
export class LoadingOverlayComponent {
  readonly visible = input(false);
  readonly message = input('Cargando...');
}
