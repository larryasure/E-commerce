import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { addWishlist, getWishlist, removeWishlist } from "../api/wishlist";
import { AuthContext } from "./AuthContext";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(false);

  const { isAuthenticated } = useContext(AuthContext);

  
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isAuthenticated) {
        setWishlists([]);
        return;
      }

      try {
        setLoading(true);
        const data = await getWishlist();
        setWishlists(data);
      } catch (error) {
        console.error("Failed to load wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [isAuthenticated]);

  const addItem = async (productId) => {
    try {
      const item = await addWishlist(productId);
      setWishlists((prev) => [item, ...prev]);
      toast.success("Added to wishlist ❤️");
    } catch (error) {
      console.error("Unable to add to wishlist", error);
      toast.error("Unable to add wishlist");
    }
  };

  const removeItem = async (wishlistId) => {
    try {
      await removeWishlist(wishlistId);
      setWishlists((prev) => prev.filter((item) => item.id !== wishlistId));
      toast.success("Removed from wishlist");
    } catch (error) {
      console.error("Unable to remove wishlist item", error);
    }
  };


  const isWishlisted = (productId) => {
    if (!wishlists) return false

     return wishlists.some((item) => item.product?.id === productId)
  }
  
  const toggleWishlist = async (productId) => {
    const existing = wishlists.find((item) => item.product?.id === productId);
    if (existing) {
      await removeItem(existing.id);
    } else {
      await addItem(productId);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlists,
        loading,
        addItem,
        removeItem,
        isWishlisted,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
