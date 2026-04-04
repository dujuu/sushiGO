import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Order } from '../../../core/models/order.model';
import { OrderService } from '../../../core/services/order.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { OrderDetailModalComponent } from '../components/order-detail-modal/order-detail-modal.component';

@Component({
  selector: 'app-admin-orders-page',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    PageHeaderComponent,
    SearchBarComponent,
    StatusBadgeComponent,
    EmptyStateComponent,
    OrderDetailModalComponent,
  ],
  templateUrl: './admin-orders-page.component.html',
  styleUrls: ['./admin-orders-page.component.css'],
})
export class AdminOrdersPageComponent implements OnInit {
  private readonly orderService = inject(OrderService);

  readonly orders = signal<Order[]>([]);
  readonly search = signal('');

  readonly selectedOrder = signal<Order | null>(null);
  readonly showDetailModal = signal(false);

  ngOnInit(): void {
    this.loadOrders();
  }

  filteredOrders(): Order[] {
    const term = this.search().toLowerCase().trim();

    return this.orders().filter((order) => {
      return (
        order.order_number.toLowerCase().includes(term) ||
        (order.notes ?? '').toLowerCase().includes(term)
      );
    });
  }

  loadOrders(): void {
    this.orderService.getOrders({ per_page: 200 }).subscribe((response) => {
      this.orders.set(response.data);
    });
  }

  openOrder(order: Order): void {
    this.selectedOrder.set(order);
    this.showDetailModal.set(true);
  }
}
