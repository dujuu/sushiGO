import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { phoneValidator } from '../../../shared/validators/customer.validators';
import { CartService } from '../../cart/services/cart.service';
import { CheckoutService } from '../services/checkout.service';
import { WhatsappService } from '../services/whatsapp.service';
import { OrdersService } from '../../orders/services/orders.service';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <h1>Checkout</h1>
    <article class="card trust-card">
      <strong>Compra segura y rápida</strong>
      <p>Sin registro. Te confirmamos por WhatsApp en menos de 5 minutos.</p>
      <div class="trust-chips">
        <span>🔒 Datos mínimos</span>
        <span>📦 Seguimiento del pedido</span>
        <span>🕒 Entrega estimada real</span>
      </div>
    </article>

    @if (statusMessage()) {
      <p class="status-message">{{ statusMessage() }}</p>
    }

    <form class="card form" [formGroup]="form" (ngSubmit)="submitWeb()">
      <label>Tipo de entrega</label>
      <div class="delivery-tabs">
        <button
          type="button"
          class="delivery-tab"
          [class.active]="form.controls.deliveryType.value === 'delivery'"
          (click)="setDeliveryType('delivery')"
        >
          🛵 Delivery
        </button>
        <button
          type="button"
          class="delivery-tab"
          [class.active]="form.controls.deliveryType.value === 'pickup'"
          (click)="setDeliveryType('pickup')"
        >
          🏪 Retiro
        </button>
      </div>

      <label>Nombre</label>
      <input type="text" formControlName="name" />
      @if (form.controls.name.touched && form.controls.name.invalid) {
        <small class="error">Ingresa un nombre válido (2 a 80 caracteres).</small>
      }

      <label>Teléfono</label>
      <input type="text" formControlName="phone" />
      @if (form.controls.phone.touched && form.controls.phone.invalid) {
        <small class="error">Teléfono inválido (solo números/símbolos permitidos).</small>
      }

      @if (form.controls.deliveryType.value === 'delivery') {
        <label>Dirección</label>
        <input type="text" formControlName="address" />
        @if (form.controls.address.touched && form.controls.address.invalid) {
          <small class="error">Máximo 180 caracteres.</small>
        }
      }

      <label>Observaciones</label>
      <textarea rows="3" formControlName="notes"></textarea>
      @if (form.controls.notes.touched && form.controls.notes.invalid) {
        <small class="error">Máximo 280 caracteres.</small>
      }

      <div class="actions">
        <button type="button" class="btn-secondary" [disabled]="isSubmitting()" (click)="sendWhatsapp()">
          Enviar por WhatsApp
        </button>
        <button
          type="submit"
          class="btn-primary"
          [disabled]="form.invalid || cartService.items().length === 0 || isSubmitting()"
        >
          @if (isSubmitting()) {
            Enviando...
          } @else {
            Registrar pedido web
          }
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      .form { display: grid; gap: 0.5rem; }
      input, textarea, select {
        background: var(--surface-2);
        border: 1px solid var(--border-2);
        border-radius: 8px;
        color: var(--white);
        padding: 0.65rem;
      }

      .trust-card {
        display: grid;
        gap: 0.45rem;
        margin-bottom: 0.8rem;
      }

      .trust-card p {
        color: var(--muted);
        font-size: 0.82rem;
      }

      .trust-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 0.45rem;
      }

      .trust-chips span {
        background: var(--surface-2);
        border: 1px solid var(--border);
        border-radius: 999px;
        color: #d8d0c8;
        font-size: 0.72rem;
        font-weight: 600;
        padding: 0.3rem 0.6rem;
      }

      .actions { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-top: 0.6rem; }

      .delivery-tabs {
        display: grid;
        gap: 0.45rem;
        grid-template-columns: 1fr 1fr;
        margin-bottom: 0.4rem;
      }

      .delivery-tab {
        background: var(--surface-2);
        border: 1px solid var(--border-2);
        border-radius: 10px;
        color: var(--muted);
        font-size: 0.8rem;
        font-weight: 700;
        padding: 0.55rem;
      }

      .delivery-tab.active {
        background: var(--orange-dim);
        border-color: color-mix(in srgb, var(--orange) 50%, transparent);
        color: #ffd7c5;
      }

      .error {
        color: #f49ca9;
        font-size: 0.8rem;
        margin-top: -0.1rem;
      }
      .status-message {
        background: color-mix(in srgb, var(--orange) 16%, transparent);
        border: 1px solid color-mix(in srgb, var(--orange) 35%, transparent);
        border-radius: 8px;
        color: #ffd2bd;
        margin-bottom: 0.8rem;
        padding: 0.55rem 0.7rem;
      }

      @media (max-width: 640px) {
        .delivery-tabs {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class CheckoutPageComponent {
  readonly cartService = inject(CartService);

  private readonly formBuilder = inject(FormBuilder);
  private readonly checkoutService = inject(CheckoutService);
  private readonly whatsappService = inject(WhatsappService);
  private readonly ordersService = inject(OrdersService);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly statusMessage = signal('');

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    phone: ['', [Validators.required, phoneValidator]],
    address: ['', [Validators.maxLength(180)]],
    deliveryType: this.formBuilder.nonNullable.control<'delivery' | 'pickup'>('delivery'),
    notes: ['', [Validators.maxLength(280)]],
  });

  setDeliveryType(value: 'delivery' | 'pickup'): void {
    this.form.controls.deliveryType.setValue(value);
  }

  sendWhatsapp(): void {
    if (this.form.invalid || this.cartService.items().length === 0) {
      this.form.markAllAsTouched();
      this.statusMessage.set('Completa los datos para enviar tu pedido por WhatsApp.');
      return;
    }

    const payload = this.checkoutService.buildOrderPayload(
      {
        name: this.form.controls.name.value,
        phone: this.form.controls.phone.value,
        address: this.form.controls.address.value,
      },
      this.form.controls.deliveryType.value,
      this.form.controls.notes.value,
    );

    window.open(this.whatsappService.buildLink(payload, '51999999999'), '_blank', 'noopener');
    this.statusMessage.set('Abrimos WhatsApp con tu pedido listo para enviar.');
  }

  submitWeb(): void {
    if (this.form.invalid || this.cartService.items().length === 0) {
      this.form.markAllAsTouched();
      this.statusMessage.set('Completa los campos requeridos para registrar el pedido.');
      return;
    }

    this.isSubmitting.set(true);
    this.statusMessage.set('Enviando pedido...');

    const payload = this.checkoutService.buildOrderPayload(
      {
        name: this.form.controls.name.value,
        phone: this.form.controls.phone.value,
        address: this.form.controls.address.value,
      },
      this.form.controls.deliveryType.value,
      this.form.controls.notes.value,
    );

    this.ordersService.create(payload).subscribe({
      next: (response) => {
        this.cartService.clear();
        this.isSubmitting.set(false);
        void this.router.navigate(['/orders', response.id, 'status']);
      },
      error: (error: Error) => {
        this.isSubmitting.set(false);
        this.statusMessage.set(error.message);
      },
    });
  }
}
