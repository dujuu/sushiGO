import { Injectable } from '@angular/core';
import { CartItem } from '../../../shared/models/cart.model';

export interface WhatsappPayload {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address?: string;
  deliveryType: 'delivery' | 'pickup';
  paymentMethod: 'cash' | 'transfer' | 'card';
  cashAmount?: number;
  cardType?: 'debit' | 'credit' | 'redcompra';
  notes?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

@Injectable({ providedIn: 'root' })
export class WhatsappService {
  buildLink(payload: WhatsappPayload, phone: string): string {
    const products = payload.items
      .filter((item) => !item.product.isPromo)
      .map((item) => `- ${item.quantity}x ${item.product.name} — $${item.subtotal.toLocaleString('es-CL')}`)
      .join('\n');

    const promotions = payload.items
      .filter((item) => item.product.isPromo)
      .map((item) => `- ${item.quantity}x ${item.product.name} — $${item.subtotal.toLocaleString('es-CL')}`)
      .join('\n');

    const paymentDetail =
      payload.paymentMethod === 'cash'
        ? `💵 Pago en efectivo con: $${(payload.cashAmount ?? 0).toLocaleString('es-CL')}`
        : payload.paymentMethod === 'card'
          ? `💳 Tipo de tarjeta: ${this.cardTypeLabel(payload.cardType)}`
          : '🏦 Transferencia bancaria (solicito datos para pagar)';

    const message = [
      'Hola, quiero realizar el siguiente pedido:',
      '',
      '🍣 Productos:',
      products || '- Sin productos individuales',
      promotions ? '' : null,
      promotions ? '🎁 Promociones:' : null,
      promotions || null,
      '',
      `📍 Tipo de entrega: ${payload.deliveryType === 'delivery' ? 'Delivery' : 'Retiro en local'}`,
      `👤 Nombre: ${payload.customerName}`,
      `📞 Teléfono: ${payload.customerPhone}`,
      `📧 Correo: ${payload.customerEmail}`,
      payload.deliveryType === 'delivery' && payload.address ? `🏠 Dirección: ${payload.address}` : null,
      '',
      `💳 Método de pago: ${this.paymentMethodLabel(payload.paymentMethod)}`,
      paymentDetail,
      '',
      payload.notes ? '📝 Observaciones:' : null,
      payload.notes || null,
      payload.notes ? '' : null,
      `🧾 Subtotal: $${payload.subtotal.toLocaleString('es-CL')}`,
      payload.deliveryType === 'delivery' ? `🛵 Delivery: $${payload.deliveryFee.toLocaleString('es-CL')}` : null,
      `💵 Total estimado: $${payload.total.toLocaleString('es-CL')}`,
    ]
      .filter(Boolean)
      .join('\n');

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }

  private paymentMethodLabel(method: 'cash' | 'transfer' | 'card'): string {
    if (method === 'cash') {
      return 'Efectivo';
    }

    if (method === 'transfer') {
      return 'Transferencia';
    }

    return 'Tarjeta';
  }

  private cardTypeLabel(type?: 'debit' | 'credit' | 'redcompra'): string {
    if (type === 'credit') {
      return 'Crédito';
    }

    if (type === 'redcompra') {
      return 'Redcompra';
    }

    return 'Débito';
  }
}
