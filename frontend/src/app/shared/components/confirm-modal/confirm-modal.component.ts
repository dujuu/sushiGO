import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  template: `
    @if (open()) {
      <div class="backdrop" (click)="close.emit()">
        <section class="modal card" (click)="$event.stopPropagation()">
          <h3 class="display-font">{{ title() }}</h3>
          <p>{{ description() }}</p>
          <div class="actions">
            <button class="btn-secondary" type="button" (click)="close.emit()">Cancelar</button>
            <button class="btn-primary" type="button" (click)="confirm.emit()">Confirmar</button>
          </div>
        </section>
      </div>
    }
  `,
  styles: [
    `
      .backdrop {
        align-items: center;
        background: rgba(0, 0, 0, 0.45);
        display: flex;
        inset: 0;
        justify-content: center;
        padding: 1rem;
        position: fixed;
        z-index: 120;
      }

      .modal {
        max-width: 420px;
        width: min(100%, 420px);
      }

      h3 {
        margin: 0;
      }

      p {
        color: var(--muted);
        font-size: 0.84rem;
      }

      .actions {
        display: flex;
        gap: 0.5rem;
        justify-content: end;
      }
    `,
  ],
})
export class ConfirmModalComponent {
  readonly open = input(false);
  readonly title = input.required<string>();
  readonly description = input.required<string>();

  readonly close = output<void>();
  readonly confirm = output<void>();
}
