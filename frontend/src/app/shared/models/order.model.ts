import { CartItem } from './cart.model';

export type DeliveryType = 'delivery' | 'pickup';

export interface CustomerInfo {
  name: string;
  phone: string;
  address?: string;
}

export interface CreateOrderRequest {
  customer: CustomerInfo;
  deliveryType: DeliveryType;
  notes?: string;
  items: CartItem[];
  total: number;
}

export interface OrderStatus {
  id: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled';
  updatedAt: string;
}
