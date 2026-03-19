export interface Product {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  price: number;
  imageUrl: string;
  category: string;
  isPromo?: boolean;
  badge?: 'popular' | 'new' | 'promo';
}

export interface Category {
  id: string;
  label: string;
}
