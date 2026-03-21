import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  template: `
    <header class="page-header">
      <div>
        <h1 class="display-font">{{ title() }}</h1>
        @if (subtitle()) {
          <p>{{ subtitle() }}</p>
        }
      </div>
      <ng-content />
    </header>
  `,
  styles: [
    `
      .page-header {
        align-items: start;
        display: flex;
        gap: 0.9rem;
        justify-content: space-between;
        margin-bottom: 1rem;
      }

      h1 {
        font-size: clamp(1.5rem, 2.2vw, 2rem);
        margin: 0;
      }

      p {
        color: var(--muted);
        font-size: 0.86rem;
        margin: 0.25rem 0 0;
      }
    `,
  ],
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
}
