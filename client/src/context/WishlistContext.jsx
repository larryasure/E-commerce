import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { addWishlist, getWishlist, removeWishlist } from "../api/wishlist";
import { AuthContext } from "./AuthContext";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const { isAuthenticated } = useContext(AuthContext);

  
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isAuthenticated) {
        setWishlist([]);
        return;
      }

      try {
        setLoading(true);
        const data = await getWishlist();
        setWishlist(data);
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
      setWishlist((prev) => [item, ...prev]);
      toast.success("Added to wishlist ❤️");
    } catch (error) {
      console.error("Unable to add to wishlist", error);
      toast.error("Unable to add wishlist");
    }
  };

  const removeItem = async (wishlistId) => {
    try {
      await removeWishlist(wishlistId);
      setWishlist((prev) => prev.filter((item) => item.id !== wishlistId));
      toast.success("Removed from wishlist");
    } catch (error) {
      console.error("Unable to remove wishlist item", error);
    }
  };


  const isWishlisted = (productId) => {
    if (!wishlist) return false

     return wishlist.some((item) => item.product?.id === productId)
  }
  const toggleWishlist = async (productId) => {
    const existing = wishlist.find((item) => item.product?.id === productId);
    if (existing) {
      await removeItem(existing.id);
    } else {
      await addItem(productId);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
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
