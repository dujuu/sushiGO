import { Component, input, output } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Order } from '../../../../core/models/order.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-order-detail-modal',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, StatusBadgeComponent],
  templateUrl: './order-detail-modal.component.html',
  styleUrls: ['./order-detail-modal.component.css'],
})
export class OrderDetailModalComponent {
  readonly open = input(false);
  readonly order = input<Order | null>(null);

  readonly close = output<void>();
}
