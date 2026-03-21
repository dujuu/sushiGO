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
  template: `
    <app-page-header title="Historial de pedidos" subtitle="Respaldo simple de pedidos enviados por WhatsApp." />

    <section class="toolbar card">
      <app-search-bar
        [value]="search()"
        placeholder="Buscar por número de pedido o nota"
        (valueChange)="search.set($event)"
      />
    </section>

    @if (filteredOrders().length === 0) {
      <app-empty-state title="Sin pedidos" description="No encontramos pedidos con estos filtros." />
    } @else {
      <section class="table card">
        @for (order of filteredOrders(); track order.id) {
          <article class="row">
            <div>
              <strong>{{ order.order_number }}</strong>
              <p>{{ order.created_at | date: 'dd/MM/yyyy HH:mm' }}</p>
            </div>

            <div>
              <p>{{ order.items.length }} item(s)</p>
              <strong>{{ order.total | currency: 'PEN' : 'symbol-narrow' }}</strong>
            </div>

            <app-status-badge [label]="order.status" />

            <button class="btn-secondary" type="button" (click)="openOrder(order)">Ver detalle</button>
          </article>
        }
      </section>
    }

    <app-order-detail-modal
      [open]="showDetailModal()"
      [order]="selectedOrder()"
      (close)="showDetailModal.set(false)"
    />
  `,
  styles: [
    `
      .toolbar {
        align-items: stretch;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 0.8rem;
      }

      .table {
        display: grid;
        gap: 0.45rem;
      }

      .row {
        align-items: start;
        border: 1px solid var(--border);
        border-radius: 10px;
        display: grid;
        gap: 0.8rem;
        grid-template-columns: 1fr;
        padding: 0.55rem;
      }

      p {
        color: var(--muted);
        margin: 0;
      }

      @media (min-width: 768px) {
        .toolbar {
          align-items: center;
          flex-direction: row;
        }

        .row {
          align-items: center;
          grid-template-columns: 1.2fr 1fr auto auto;
        }
      }
    `,
  ],
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
