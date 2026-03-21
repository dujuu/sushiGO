export interface CreateOrderRequest {
  notes?: string;
  items: Array<{
    product_id: number;
    quantity: number;
  }>;
}

export interface OrderStatus {
  id: number;
  order_number: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'completed' | 'cancelled';
  updated_at: string;
}
