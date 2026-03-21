import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { phoneValidator } from '../../../shared/validators/customer.validators';
import { CartService } from '../../cart/services/cart.service';
import { CheckoutService } from '../services/checkout.service';
import { WhatsappPayload, WhatsappService } from '../services/whatsapp.service';
import { OrdersService } from '../../orders/services/orders.service';
import { CurrencyPipe } from '@angular/common';
import { BusinessSettingsService } from '../../../core/services/business-settings.service';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe],
  template: `
    <h1>Finaliza tu pedido</h1>
    <article class="card trust-card">
      <strong>Pedido directo por WhatsApp</strong>
      <p>Completa tus datos y te abrimos el mensaje listo para enviar al local.</p>
      <div class="trust-chips">
        <span>🕒 {{ settings().openingHours }}</span>
        <span>🛵 Zonas: {{ settings().deliveryZones }}</span>
        <span>💬 Confirmación por WhatsApp</span>
      </div>
    </article>

    @if (statusMessage()) {
      <p class="status-message">{{ statusMessage() }}</p>
    }

    <div class="layout-grid">
      <form class="card form" [formGroup]="form" (ngSubmit)="submitOrder()">
        <h2 class="display-font">Datos del cliente</h2>
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

        <label>Correo</label>
        <input type="email" formControlName="email" />
        @if (form.controls.email.touched && form.controls.email.invalid) {
          <small class="error">Ingresa un correo válido.</small>
        }

        <h2 class="display-font">Tipo de entrega</h2>
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

        <label>Dirección</label>
        <input
          type="text"
          formControlName="address"
          [placeholder]="form.controls.deliveryType.value === 'pickup' ? 'Opcional para retiro' : 'Obligatoria para delivery'"
        />
        @if (form.controls.address.touched && form.controls.address.invalid) {
          <small class="error">Para delivery, la dirección es obligatoria (máx. 180 caracteres).</small>
        }

        <h2 class="display-font">Método de pago</h2>
        <select formControlName="paymentMethod">
          <option value="cash">Efectivo</option>
          <option value="transfer">Transferencia</option>
          <option value="card">Tarjeta</option>
        </select>

        @if (form.controls.paymentMethod.value === 'cash') {
          <label>¿Con cuánto paga?</label>
          <input type="number" min="1000" formControlName="cashAmount" />
          @if (form.controls.cashAmount.touched && form.controls.cashAmount.invalid) {
            <small class="error">Ingresa un monto válido para efectivo.</small>
          }
        }

        @if (form.controls.paymentMethod.value === 'card') {
          <label>Tipo de tarjeta</label>
          <select formControlName="cardType">
            <option value="debit">Débito</option>
            <option value="credit">Crédito</option>
            <option value="redcompra">Redcompra</option>
          </select>
        }

        @if (form.controls.paymentMethod.value === 'transfer') {
          <article class="transfer-card">
            <strong>Pago por transferencia</strong>
            <p>Titular: {{ settings().transferOwner }}</p>
            <p>Banco: {{ settings().transferBank }}</p>
            <p>Alias/Cuenta: {{ settings().transferAlias }}</p>
            <p>RUT: {{ settings().transferRut }}</p>
          </article>
        }

        <label>Observaciones</label>
        <textarea rows="3" formControlName="notes"></textarea>
        @if (form.controls.notes.touched && form.controls.notes.invalid) {
          <small class="error">Máximo 280 caracteres.</small>
        }

        <div class="actions">
          <button
            type="submit"
            class="btn-primary"
            [disabled]="form.invalid || cartService.items().length === 0 || isSubmitting()"
          >
            @if (isSubmitting()) {
              Abriendo WhatsApp...
            } @else {
              Enviar pedido por WhatsApp
            }
          </button>
        </div>
      </form>

      <aside class="card summary">
        <h2 class="display-font">Resumen del pedido</h2>

        <div class="line-items">
          @for (item of cartService.items(); track item.product.id) {
            <article class="line-item">
              <div>
                <strong>{{ item.product.name }}</strong>
                <small>{{ item.quantity }} x {{ (item.subtotal / item.quantity) | currency : 'CLP' : 'symbol' : '1.0-0' }}</small>
              </div>
              <strong>{{ item.subtotal | currency : 'CLP' : 'symbol' : '1.0-0' }}</strong>
            </article>
          }
        </div>

        <p>Subtotal: <strong>{{ subtotal() | currency : 'CLP' : 'symbol' : '1.0-0' }}</strong></p>
        <p>
          Delivery:
          <strong>
            {{ deliveryFee() | currency : 'CLP' : 'symbol' : '1.0-0' }}
          </strong>
        </p>
        <p class="total">Total estimado: {{ total() | currency : 'CLP' : 'symbol' : '1.0-0' }}</p>
      </aside>
    </div>
  `,
  styles: [
    `
      .layout-grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: 1fr;
      }

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
        grid-template-columns: 1fr;
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

      .summary {
        align-content: start;
        display: grid;
        gap: 0.55rem;
        height: fit-content;
        position: static;
      }

      .line-items {
        display: grid;
        gap: 0.4rem;
      }

      .line-item {
        align-items: center;
        display: flex;
        justify-content: space-between;
      }

      .line-item small {
        color: var(--muted);
        display: block;
      }

      .transfer-card {
        background: var(--surface-2);
        border: 1px solid var(--border);
        border-radius: 10px;
        color: #ddd4cd;
        padding: 0.6rem;
      }

      .transfer-card p {
        margin: 0.15rem 0;
      }

      .total {
        color: var(--white);
        font-weight: 700;
      }

      .status-message {
        background: color-mix(in srgb, var(--orange) 16%, transparent);
        border: 1px solid color-mix(in srgb, var(--orange) 35%, transparent);
        border-radius: 8px;
        color: #ffd2bd;
        margin-bottom: 0.8rem;
        padding: 0.55rem 0.7rem;
      }

      @media (min-width: 480px) {
        .delivery-tabs {
          grid-template-columns: 1fr 1fr;
        }
      }

      @media (min-width: 1024px) {
        .layout-grid {
          grid-template-columns: minmax(0, 1fr) 320px;
        }

        .summary {
          position: sticky;
          top: 5.8rem;
        }
      }
    `,
  ],
})
export class CheckoutPageComponent {
  readonly cartService = inject(CartService);
  readonly settingsService = inject(BusinessSettingsService);

  private readonly formBuilder = inject(FormBuilder);
  private readonly checkoutService = inject(CheckoutService);
  private readonly whatsappService = inject(WhatsappService);
  private readonly ordersService = inject(OrdersService);

  readonly isSubmitting = signal(false);
  readonly statusMessage = signal('');
  readonly settings = this.settingsService.settings;
  readonly subtotal = computed(() => this.cartService.total());
  readonly deliveryFee = computed(() =>
    this.form.controls.deliveryType.value === 'delivery' ? this.settings().deliveryFee : 0,
  );
  readonly total = computed(() => this.subtotal() + this.deliveryFee());

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    phone: ['', [Validators.required, phoneValidator]],
    email: ['', [Validators.required, Validators.email]],
    address: ['', [Validators.maxLength(180)]],
    deliveryType: this.formBuilder.nonNullable.control<'delivery' | 'pickup'>('delivery'),
    paymentMethod: this.formBuilder.nonNullable.control<'cash' | 'transfer' | 'card'>('cash'),
    cashAmount: this.formBuilder.control<number | null>(null),
    cardType: this.formBuilder.control<'debit' | 'credit' | 'redcompra' | null>(null),
    notes: ['', [Validators.maxLength(280)]],
  });

  constructor() {
    this.form.controls.deliveryType.valueChanges.subscribe(() => this.updateDynamicValidators());
    this.form.controls.paymentMethod.valueChanges.subscribe(() => this.updateDynamicValidators());
    this.updateDynamicValidators();
  }

  setDeliveryType(value: 'delivery' | 'pickup'): void {
    this.form.controls.deliveryType.setValue(value);
  }

  submitOrder(): void {
    if (this.form.invalid || this.cartService.items().length === 0) {
      this.form.markAllAsTouched();
      this.statusMessage.set('Completa los datos para generar el pedido por WhatsApp.');
      return;
    }

    this.isSubmitting.set(true);

    const summary = this.buildSummaryPayload();
    const backupPayload = this.checkoutService.buildOrderPayload(summary);

    this.ordersService.create(backupPayload).subscribe({
      next: () => {
        this.openWhatsapp(summary);
      },
      error: () => {
        this.openWhatsapp(summary);
      },
    });
  }

  private openWhatsapp(payload: WhatsappPayload): void {
    const whatsappNumber = this.settings().whatsappNumber;
    window.open(this.whatsappService.buildLink(payload, whatsappNumber), '_blank', 'noopener');
    this.isSubmitting.set(false);
    this.statusMessage.set('Abrimos WhatsApp con tu pedido listo para enviar al local.');
  }

  private buildSummaryPayload(): WhatsappPayload {
    return {
      customerName: this.form.controls.name.value,
      customerPhone: this.form.controls.phone.value,
      customerEmail: this.form.controls.email.value,
      address: this.form.controls.address.value,
      deliveryType: this.form.controls.deliveryType.value,
      paymentMethod: this.form.controls.paymentMethod.value,
      cashAmount: this.form.controls.cashAmount.value ?? undefined,
      cardType: this.form.controls.cardType.value ?? undefined,
      notes: this.form.controls.notes.value,
      items: this.cartService.items(),
      subtotal: this.subtotal(),
      deliveryFee: this.deliveryFee(),
      total: this.total(),
    };
  }

  private updateDynamicValidators(): void {
    const isDelivery = this.form.controls.deliveryType.value === 'delivery';
    const paymentMethod = this.form.controls.paymentMethod.value;

    this.form.controls.address.setValidators(
      isDelivery
        ? [Validators.required, Validators.minLength(6), Validators.maxLength(180)]
        : [Validators.maxLength(180)],
    );

    this.form.controls.cashAmount.setValidators(
      paymentMethod === 'cash' ? [Validators.required, Validators.min(1000)] : [],
    );

    this.form.controls.cardType.setValidators(paymentMethod === 'card' ? [Validators.required] : []);

    if (paymentMethod !== 'cash') {
      this.form.controls.cashAmount.setValue(null);
    }

    if (paymentMethod !== 'card') {
      this.form.controls.cardType.setValue(null);
    }

    this.form.controls.address.updateValueAndValidity({ emitEvent: false });
    this.form.controls.cashAmount.updateValueAndValidity({ emitEvent: false });
    this.form.controls.cardType.updateValueAndValidity({ emitEvent: false });
  }
}
