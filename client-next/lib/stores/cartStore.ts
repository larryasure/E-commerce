import { create } from "zustand";
import { CartSerializer } from "@/lib/types";
import { useAuthStore } from "./authStore";
import { axiosInstance } from "../api/client";

interface CartStore {
  cart: CartSerializer | null;
  isLoading: boolean;
  isSyncing: boolean; // Tracks background synchronization status

  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  increaseQuantity: (itemId: number) => Promise<void>;
  decreaseQuantity: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartStore>((set, get) => ({
  cart: null,
  isLoading: false,
  isSyncing: false,

  // 1. Fetch Cart: Removed unused token parameter since axiosInstance handles interceptors
  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get<CartSerializer>("/cart/");
      set({ cart: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // 2. Add Item
  addItem: async (productId: number, quantity: number) => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    set({ isSyncing: true });
    try {
      const response = await axiosInstance.post<CartSerializer>("/cart/add/", {
        product_id: productId,
        quantity,
      });
      set({ cart: response.data, isSyncing: false });
    } catch (error) {
      set({ isSyncing: false });
      throw error;
    }
  },

  // 3. Remove Item: Safe fallback prevents typescript 'undefined' array errors
  removeItem: async (itemId: number) => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    const previousCart = get().cart;
    if (!previousCart) return;

    // Optimistic UI Update: Filters out target item instantly
    set({
      cart: {
        ...previousCart,
        items: (previousCart.items || []).filter((item) => item.id !== itemId),
      },
      isSyncing: true,
    });

    try {
      const response = await axiosInstance.delete(`/cart/${itemId}/remove/`);
      
      if (response.data) {
        set({ cart: response.data, isSyncing: false });
      } else {
        set({ isSyncing: false });
      }
    } catch (error) {
      set({ cart: previousCart, isSyncing: false }); // Rollback
      throw error;
    }
  },

  // 4. Increase Quantity: Instantly increments local view count
  increaseQuantity: async (itemId: number) => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    const previousCart = get().cart;
    if (!previousCart) return;

    // Optimistic UI Update
    set({
      cart: {
        ...previousCart,
        items: (previousCart.items || []).map((item) =>
          item.id === itemId ? { ...item, quantity: (item.quantity || 0) + 1 } : item
        ),
      },
      isSyncing: true,
    });

    try {
      const response = await axiosInstance.patch<CartSerializer>(
        `/cart/${itemId}/increase/`,
        { quantity: 1 }
      );
      set({ cart: response.data, isSyncing: false });
    } catch (error) {
      set({ cart: previousCart, isSyncing: false }); // Rollback
      throw error;
    }
  },

  // 5. Decrease Quantity: Automatically safely drops the item if quantity hits 1
  decreaseQuantity: async (itemId: number) => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    const previousCart = get().cart;
    if (!previousCart) return;

    // Type-safe finder using array fallback
    const targetItem = (previousCart.items || []).find((item) => item.id === itemId);
    if (!targetItem) return;

    // Zero-Guard Check: If quantity drops past 1, discard item entirely
    const currentQty = targetItem.quantity || 1;
    if (currentQty <= 1) {
      await get().removeItem(itemId);
      return;
    }

    // Optimistic UI Update
    set({
      cart: {
        ...previousCart,
        items: (previousCart.items || []).map((item) =>
          item.id === itemId ? { ...item, quantity: currentQty - 1 } : item
        ),
      },
      isSyncing: true,
    });

    try {
      const response = await axiosInstance.patch<CartSerializer>(
        `/cart/${itemId}/decrease/`,
        { quantity: 1 }
      );
      set({ cart: response.data, isSyncing: false });
    } catch (error) {
      set({ cart: previousCart, isSyncing: false }); 
      throw error;
    }
  },

  // 6. Clear Cart
  clearCart: async () => {
    const previousCart = get().cart;
    set({ cart: null, isSyncing: true });

    try {
      await axiosInstance.delete("/cart/clear/");
      set({ isSyncing: false });
    } catch (error) {
      set({ cart: previousCart, isSyncing: false }); // Rollback
      throw error;
    }
  },
}));
