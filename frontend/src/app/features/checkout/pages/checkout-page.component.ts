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
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css'],
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
  readonly statusType = signal<'info' | 'success' | 'error'>('info');
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
      this.statusType.set('error');
      this.statusMessage.set('Completa los datos para generar el pedido por WhatsApp.');
      return;
    }

    this.isSubmitting.set(true);
    this.statusType.set('info');
    this.statusMessage.set('Enviando pedido...');

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
    this.statusType.set('success');
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
