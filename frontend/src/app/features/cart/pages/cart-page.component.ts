import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  template: `
    <h1>Carrito</h1>
    @if (cartService.items().length === 0) {
      <article class="card empty-state">
        <p>Tu carrito está vacío.</p>
        <small>Empieza con nuestros más pedidos de hoy.</small>
        <a routerLink="/catalog" class="btn-secondary">Ver catálogo</a>
      </article>
    } @else {
      <article class="card progress-card">
        @if (remainingForFreeDelivery() > 0) {
          <p>
            Te faltan
            <strong>{{ remainingForFreeDelivery() | currency : 'CLP' : 'symbol' : '1.0-0' }}</strong>
            para despacho promocional.
          </p>
        } @else {
          <p>🎉 ¡Activaste despacho promocional para este pedido!</p>
        }
        <div class="progress-track">
          <div class="progress-value" [style.width.%]="freeDeliveryProgress()"></div>
        </div>
      </article>

      <div class="layout-grid">
        <div class="grid">
        @for (item of cartService.items(); track item.product.id) {
          <article class="card">
            <h2>{{ item.product.name }}</h2>
            <p class="subtotal">{{ item.subtotal | currency : 'CLP' : 'symbol' : '1.0-0' }}</p>
            <div class="qty-actions">
              <button class="qty-btn" (click)="decrease(item.product.id, item.quantity)">−</button>
              <span class="qty">{{ item.quantity }}</span>
              <button class="qty-btn" (click)="increase(item.product.id, item.quantity)">+</button>
              <button class="btn-secondary delete" (click)="cartService.remove(item.product.id)">Eliminar</button>
            </div>
          </article>
        }
        </div>
        <aside class="card summary">
          <h3>Resumen</h3>
          <p>Productos: {{ cartService.itemCount() }}</p>
          <p>Confirmación: <strong>en menos de 5 minutos</strong></p>
          <h2>Total: {{ cartService.total() | currency : 'CLP' : 'symbol' : '1.0-0' }}</h2>
          <small class="summary-note">Sin registro, pago seguro y seguimiento por WhatsApp.</small>
          <a routerLink="/checkout" class="btn-primary">Continuar pedido</a>
        </aside>
      </div>
    }
  `,
  styles: [
    `
      .layout-grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: minmax(0, 1fr) 280px;
      }

      .progress-card {
        display: grid;
        gap: 0.6rem;
        margin-bottom: 0.9rem;
      }

      .progress-card p {
        color: #ebdfd4;
        font-size: 0.86rem;
      }

      .progress-track {
        background: var(--surface-2);
        border: 1px solid var(--border);
        border-radius: 999px;
        height: 10px;
        overflow: hidden;
      }

      .progress-value {
        background: linear-gradient(90deg, #ff6a29, var(--orange));
        height: 100%;
        transition: width 0.3s ease;
      }

      .grid {
        display: grid;
        gap: 1rem;
      }

      .subtotal {
        color: #ebedf2;
        font-weight: 600;
      }

      .qty-actions {
        align-items: center;
        display: flex;
        gap: 0.5rem;
      }

      .qty-btn {
        background: #252b38;
        border: 1px solid #364056;
        border-radius: 8px;
        color: var(--text);
        cursor: pointer;
        font-size: 1rem;
        font-weight: 700;
        height: 34px;
        width: 34px;
      }

      .qty {
        min-width: 1.5rem;
        text-align: center;
      }

      .delete {
        margin-left: auto;
      }

      .summary {
        align-content: start;
        display: grid;
        gap: 0.75rem;
        height: fit-content;
        position: sticky;
        top: 5.8rem;
      }

      .summary-note {
        color: var(--muted);
        font-size: 0.76rem;
      }

      .empty-state {
        display: grid;
        gap: 0.7rem;
        justify-items: start;
        max-width: 360px;
      }

      .empty-state small {
        color: var(--muted);
      }

      @media (max-width: 900px) {
        .layout-grid {
          grid-template-columns: 1fr;
        }

        .summary {
          position: static;
        }
      }
    `,
  ],
})
export class CartPageComponent {
  readonly cartService = inject(CartService);
  readonly freeDeliveryGoal = 25000;
  readonly remainingForFreeDelivery = computed(() =>
    Math.max(this.freeDeliveryGoal - this.cartService.total(), 0),
  );
  readonly freeDeliveryProgress = computed(() =>
    Math.min((this.cartService.total() / this.freeDeliveryGoal) * 100, 100),
  );

  increase(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity + 1);
  }

  decrease(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, Math.max(1, quantity - 1));
  }
}
