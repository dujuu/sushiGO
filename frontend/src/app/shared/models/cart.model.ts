import { Product } from './catalog.model';

export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface CartSummary {
  items: CartItem[];
  total: number;
}
