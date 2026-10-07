import { create } from "zustand";
import { axiosInstance } from "../api/client";
import { WishListSerializer } from "@/lib/types";
import { toast } from "sonner";

interface WishlistStore {
  wishlists: WishListSerializer[];
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
  addItem: (productId: number) => Promise<void>;
  removeItem: (wishlistId: number) => Promise<void>;
  isWishlisted: (productId: number) => boolean;
  toggleWishlist: (productId: number) => Promise<void>;
}


export const useWishlistStore = create<WishlistStore>((set, get) => ({
  wishlists: [],
  isLoading: false,

  fetchWishlist: async () => {
    set({ isLoading: true });

    try {
      const response = await axiosInstance.get("/wishlist/");

      const wishlistData = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      set({
        wishlists: wishlistData,
        isLoading: false,
      });

      // console.log("Wishlist loaded:", wishlistData);
    } catch (error) {
      set({ isLoading: false });
      console.error("Failed to load wishlist:", error);
    }
  },

  addItem: async (productId: number) => {
    try {
      const response = await axiosInstance.post<WishListSerializer>(
        "/wishlist/",
        {
          product_id: productId,
        },
      );

      set((state) => ({
        wishlists: [response.data, ...state.wishlists],
      }));

      toast.success("Added to wishlist");
    } catch (error) {
      console.error("Unable to add wishlist:", error);
      toast.error("Unable to add wishlist");
    }
  },

  removeItem: async (wishlistId: number) => {
    try {
      await axiosInstance.delete(`/wishlist/${wishlistId}/`);

      set((state) => ({
        wishlists: state.wishlists.filter((item) => item.id !== wishlistId),
      }));

      toast.success("Removed from wishlist");
    } catch (error) {
      console.error("Unable to remove wishlist:", error);
      toast.error("Unable to remove wishlist");
    }
  },

  isWishlisted: (productId: number) => {
    return get().wishlists.some((item) => item.product?.id === productId);
  },

  toggleWishlist: async (productId: number) => {
    const existing = get().wishlists.find(
      (item) => item.product?.id === productId,
    );

    if (existing?.id !== undefined) {
      await get().removeItem(existing.id);
    } else {
      await get().addItem(productId);
    }
  },
}));
