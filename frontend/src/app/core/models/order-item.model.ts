import { Product } from './product.model';

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  unit_price: string;
  quantity: number;
  subtotal: string;
  product?: Product;
}
