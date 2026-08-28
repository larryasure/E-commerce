export interface CategorySerializer {
    id?: number;
    name: string;
    slug: string;
    stock?: number;
    image?: File | null;
}

export interface ProductSerializer {
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
    discount_percentage?: any;
    original_price?: number | null;
    rating?: number;
    rating_count?: number;
}

export interface UserProfileSerializer {
    id?: number;
    avatar?: File | null;
    bio?: string;
    phone_number?: string;
    address?: string;
    is_verified?: boolean;
    customer_id?: string;
    user: number;
}

export interface UserSerializer {
    id?: number;
    username: string;
    email: string;
    password: string;
    profile?: UserProfileSerializer;
    is_staff?: boolean;
}

export interface OrderItemSerializer {
    id?: number;
    product?: ProductSerializer;
    quantity?: number;
    price: number;
    order: number;
}

export interface OrderSerializer {
    id?: number;
    items?: OrderItemSerializer[];
    user?: UserSerializer;
    total_price?: number;
    payment_status?: "PENDING" | "PAID" | "FAILED";
    order_status?: "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELED";
    payment_intent_id?: string | null;
    tx_ref?: string | null;
    shipping_address?: string | null;
    created_at?: string;
    updated_at?: string;
    order_number?: string;
}

export interface WishListSerializer {
    id?: number;
    product?: ProductSerializer;
    product_id: number;
    created_at?: string;
}

export interface CartItemSerializer {
    id?: number;
    product?: ProductSerializer;
    product_id: number;
    quantity: number;
    subtotal?: null;
}

export interface CartSerializer {
    id?: number;
    items?: CartItemSerializer[];
    subtotal?: null;
    total_items?: null;
    shipping?: null;
    grand_total?: null;
    created_at?: string;
    updated_at?: string;
}

