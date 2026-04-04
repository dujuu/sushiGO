import { Component, effect, input, output, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { OrderStatus } from '../../../../core/models/order.model';

@Component({
  selector: 'app-order-status-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './order-status-modal.component.html',
  styleUrls: ['./order-status-modal.component.css'],
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
