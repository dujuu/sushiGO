export interface Product {
  id: number;
  name: string;
  description: string;
  ingredients: string[];
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category: string;
  isPromo?: boolean;
  badge?: 'popular' | 'new' | 'promo';
}

export interface Category {
  id: string;
  label: string;
}
