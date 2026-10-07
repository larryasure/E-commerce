import { CategorySerializer } from "../types/api";

export * from "../types/api"


export interface AuthResponse {
  access: string;
  refresh: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  total_pages: number;
  next: string | null;
  previous: string | null;
  results: T[];
}


export interface FeaturedProducts { 
     id?: number;
    category?: CategorySerializer;
    category_id: number;
    name: string;
    slug: string;
    description?: string;
    price: number;
    image?: File | null;
    created_at?: string;
    stock?: number;
    is_active?: boolean;
    featured?: boolean;
    is_new?: null;
    is_in_wishlist?: null;
    discount_percentage?: number;
    original_price?: number | null;
    rating?: number;
    rating_count?: number;

}
