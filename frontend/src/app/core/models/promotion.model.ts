import { Product } from './product.model';

export type PromotionProductView = Product & { quantity?: number };

export interface PromotionProduct {
  product_id: number;
  quantity: number;
}

export interface Promotion {
  id: number;
  name: string;
  description: string | null;
  original_price: string | null;
  promo_price: string;
  image: string | null;
  is_active: boolean;
  products: PromotionProductView[];
  created_at: string;
  updated_at: string;
}

export interface PromotionPayload {
  name: string;
  description?: string | null;
  original_price?: number | null;
  promo_price: number;
  image?: string | null;
  is_active?: boolean;
  products?: PromotionProduct[];
}
