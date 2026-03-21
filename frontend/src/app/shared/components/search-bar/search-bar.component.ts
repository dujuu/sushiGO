import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  template: `
    <label class="search">
      <input
        type="search"
        [placeholder]="placeholder()"
        [value]="value()"
        (input)="onInput($event)"
      />
    </label>
  `,
  styles: [
    `
      .search {
        display: inline-flex;
        min-width: 260px;
      }

      input {
        background: var(--surface-2);
        border: 1px solid var(--border-2);
        border-radius: 10px;
        color: var(--white);
        font-size: 0.82rem;
        padding: 0.58rem 0.75rem;
        width: 100%;
      }
    `,
  ],
})
export class SearchBarComponent {
  readonly placeholder = input('Buscar...');
  readonly value = input('');
  readonly valueChange = output<string>();

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.valueChange.emit(value);
  }
}
