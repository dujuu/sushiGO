import { Component, input, output } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Order } from '../../../../core/models/order.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-order-detail-modal',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, StatusBadgeComponent],
  template: `
    @if (open() && order()) {
      <div class="backdrop" (click)="close.emit()">
        <section class="card modal" (click)="$event.stopPropagation()">
          <header>
            <div>
              <h3 class="display-font">Pedido {{ order()!.order_number }}</h3>
              <p>{{ order()!.created_at | date: 'dd/MM/yyyy HH:mm' }}</p>
            </div>
            <app-status-badge [label]="order()!.status" />
          </header>

          <div class="meta">
            <p><strong>Cliente:</strong> {{ order()!.user?.name || 'Invitado' }}</p>
            <p><strong>Email:</strong> {{ order()!.user?.email || 'No registrado' }}</p>
            <p><strong>Notas:</strong> {{ order()!.notes || 'Sin notas' }}</p>
          </div>

          <div class="items">
            @for (item of order()!.items; track item.id) {
              <article>
                <span>{{ item.product_name }} x{{ item.quantity }}</span>
                <strong>{{ item.subtotal | currency: 'PEN' : 'symbol-narrow' }}</strong>
              </article>
            }
          </div>

          <footer>
            <div>
              <p>Subtotal: {{ order()!.subtotal | currency: 'PEN' : 'symbol-narrow' }}</p>
              <p>Descuento: {{ order()!.discount | currency: 'PEN' : 'symbol-narrow' }}</p>
              <p class="total">Total: {{ order()!.total | currency: 'PEN' : 'symbol-narrow' }}</p>
            </div>
            <div class="actions">
              <button class="btn-secondary" type="button" (click)="close.emit()">Cerrar</button>
            </div>
          </footer>
        </section>
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
        gap: 0.7rem;
        max-height: calc(100vh - 2rem);
        overflow: auto;
        width: min(100%, 760px);
      }

      header,
      footer {
        align-items: center;
        display: flex;
        justify-content: space-between;
      }

      header p,
      .meta p {
        color: var(--muted);
        font-size: 0.82rem;
        margin: 0.08rem 0;
      }

      .items {
        display: grid;
        gap: 0.38rem;
      }

      .items article {
        align-items: center;
        background: var(--surface-2);
        border: 1px solid var(--border);
        border-radius: 10px;
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0.6rem;
      }

      .total {
        color: var(--white);
        font-weight: 700;
      }

      .actions {
        display: flex;
        gap: 0.5rem;
      }
    `,
  ],
})
export class OrderDetailModalComponent {
  readonly open = input(false);
  readonly order = input<Order | null>(null);

  readonly close = output<void>();
}
