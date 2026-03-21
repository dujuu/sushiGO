import { OrderItem } from './order-item.model';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'delivering'
  | 'completed'
  | 'cancelled';

export interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  subtotal: string;
  discount: string;
  total: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  user: {
    id: number;
    name: string;
    email: string;
  } | null;
}

export interface OrderStatusPayload {
  status: OrderStatus;
}

export interface DashboardStats {
  totalProducts: number;
  activePromotions: number;
  totalOrders: number;
  pendingOrders: number;
  preparingOrders: number;
  completedOrders: number;
}
