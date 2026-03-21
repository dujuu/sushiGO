import { Component, effect, input, output, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { OrderStatus } from '../../../../core/models/order.model';

@Component({
  selector: 'app-order-status-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    @if (open()) {
      <div class="backdrop" (click)="close.emit()">
        <form class="card modal" [formGroup]="form" (click)="$event.stopPropagation()" (ngSubmit)="submit()">
          <h3 class="display-font">Actualizar estado</h3>

          <label>Estado</label>
          <select formControlName="status">
            @for (status of statuses; track status) {
              <option [value]="status">{{ status }}</option>
            }
          </select>

          <div class="actions">
            <button class="btn-secondary" type="button" (click)="close.emit()">Cancelar</button>
            <button class="btn-primary" type="submit" [disabled]="saving() || form.invalid">
              {{ saving() ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    }
  `,
  styles: [
    `
      .backdrop {
        align-items: center;
        background: rgba(0, 0, 0, 0.55);
        display: flex;
        inset: 0;
        justify-content: center;
        padding: 1rem;
        position: fixed;
        z-index: 120;
      }

      .modal {
        display: grid;
        gap: 0.55rem;
        width: min(100%, 360px);
      }

      select {
        background: var(--surface-2);
        border: 1px solid var(--border-2);
        border-radius: 10px;
        color: var(--white);
        padding: 0.55rem 0.65rem;
      }

      .actions {
        display: flex;
        gap: 0.5rem;
        justify-content: end;
      }
    `,
  ],
})
export class OrderStatusModalComponent {
  readonly open = input(false);
  readonly saving = input(false);
  readonly currentStatus = input<OrderStatus>('pending');

  readonly close = output<void>();
  readonly save = output<OrderStatus>();

  readonly statuses: OrderStatus[] = [
    'pending',
    'confirmed',
    'preparing',
    'delivering',
    'completed',
    'cancelled',
  ];

  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    status: ['pending' as OrderStatus, Validators.required],
  });

  constructor() {
    effect(() => {
      this.form.controls.status.setValue(this.currentStatus());
    });
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.save.emit(this.form.controls.status.value);
  }
}
