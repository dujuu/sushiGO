import { Injectable } from '@angular/core';
import { CartService } from '../../cart/services/cart.service';
import { CreateOrderRequest } from '../../../shared/models/order.model';
import { WhatsappPayload } from './whatsapp.service';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  constructor(private readonly cartService: CartService) {}

  buildOrderPayload(summary: WhatsappPayload): CreateOrderRequest {
    const backupNotes = [
      summary.notes?.trim() || null,
      `Cliente: ${summary.customerName}`,
      `Teléfono: ${summary.customerPhone}`,
      `Correo: ${summary.customerEmail}`,
      `Entrega: ${summary.deliveryType}`,
      summary.deliveryType === 'delivery' ? `Dirección: ${summary.address ?? 'No informada'}` : null,
      `Pago: ${summary.paymentMethod}`,
      summary.paymentMethod === 'cash' ? `Con cuánto paga: ${summary.cashAmount ?? 0}` : null,
      summary.paymentMethod === 'card' ? `Tarjeta: ${summary.cardType ?? 'debit'}` : null,
      `Subtotal: ${summary.subtotal}`,
      `Delivery: ${summary.deliveryFee}`,
      `Total estimado: ${summary.total}`,
    ]
      .filter(Boolean)
      .join(' | ');

    return {
      notes: backupNotes,
      items: this.cartService.items().map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
    };
  }
}
