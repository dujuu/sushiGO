import { Injectable } from '@angular/core';
import { CreateOrderRequest } from '../../../shared/models/order.model';

@Injectable({ providedIn: 'root' })
export class WhatsappService {
  buildLink(order: CreateOrderRequest, phone: string): string {
    const items = order.items
      .map((item) => `- ${item.quantity}x ${item.product.name} ($${item.subtotal.toFixed(2)})`)
      .join('\n');

    const message = [
      '🍣 Nuevo pedido Sushi',
      `Cliente: ${order.customer.name}`,
      `Teléfono: ${order.customer.phone}`,
      order.customer.address ? `Dirección: ${order.customer.address}` : null,
      `Entrega: ${order.deliveryType}`,
      'Items:',
      items,
      `Total: $${order.total.toFixed(2)}`,
      order.notes ? `Notas: ${order.notes}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }
}
