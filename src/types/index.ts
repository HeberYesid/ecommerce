// Shared types for the ecommerce application

export interface Review {
  id: string | number;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  image_url: string;
  seller_id: string;
  category: string;
  stock: number;
  reviews?: Review[];
  created_at?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export type UserRole = 'customer' | 'seller' | null;
