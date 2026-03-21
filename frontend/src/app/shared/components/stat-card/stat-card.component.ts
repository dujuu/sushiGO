import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <article class="stat-card card">
      <small>{{ label() }}</small>
      @if (currency()) {
        <strong>{{ value() | currency : 'CLP' : 'symbol' : '1.0-0' }}</strong>
      } @else {
        <strong>{{ value() }}</strong>
      }
      @if (hint()) {
        <p>{{ hint() }}</p>
      }
    </article>
  `,
  styles: [
    `
      .stat-card {
        display: grid;
        gap: 0.2rem;
      }

      small {
        color: var(--muted);
        font-size: 0.75rem;
      }

      strong {
        font-size: 1.45rem;
      }

      p {
        color: #c9c0b9;
        font-size: 0.78rem;
        margin: 0;
      }
    `,
  ],
})
export class StatCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<number>();
  readonly hint = input<string>('');
  readonly currency = input(false);
}
