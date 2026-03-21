export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  image: string | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductPayload {
  name: string;
  description?: string | null;
  price: number;
  image?: string | null;
  is_available?: boolean;
}
