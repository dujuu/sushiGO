import { Injectable } from '@angular/core';
import { CartService } from '../../cart/services/cart.service';
import { CreateOrderRequest, CustomerInfo, DeliveryType } from '../../../shared/models/order.model';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  constructor(private readonly cartService: CartService) {}

  buildOrderPayload(
    customer: CustomerInfo,
    deliveryType: DeliveryType,
    notes?: string,
  ): CreateOrderRequest {
    return {
      customer,
      deliveryType,
      notes,
      items: this.cartService.items(),
      total: this.cartService.total(),
    };
  }
}
