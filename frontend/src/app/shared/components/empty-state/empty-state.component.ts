import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <article class="empty card">
      <h3 class="display-font">{{ title() }}</h3>
      <p>{{ description() }}</p>
      <ng-content />
    </article>
  `,
  styles: [
    `
      .empty {
        display: grid;
        gap: 0.4rem;
        justify-items: start;
        padding: 1.2rem;
        text-align: left;
      }

      h3 {
        font-size: 1.15rem;
        margin: 0;
      }

      p {
        color: var(--muted);
        font-size: 0.84rem;
        margin: 0;
      }
    `,
  ],
})
export class EmptyStateComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}
