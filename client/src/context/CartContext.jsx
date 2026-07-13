import { createContext, useContext, useEffect, useState } from "react";
import {
  addCartApi,
  clearCartApi,
  decreaseCartApi,
  getCartApi,
  increaseCartApi,
  removeCartApi,
} from "../utils/cart";
import { AuthContext } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const { isAuthenticated } = useContext(AuthContext);

  const fetchCart = async () => {
    try {
      setLoading(true);

      const data = await getCartApi();
      setCart(data);
    } catch (error) {
      console.error("Failed to load cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  const addCart = async (productId) => {
    try {
      const updatedCart = await addCartApi(productId, 1);
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to add item:", error);
    }
    fetchCart();
  };

  const increaseCart = async (itemId) => {
    try {
      const updatedCart = await increaseCartApi(itemId);
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to increase quantity:", error);
    }
    fetchCart();
  };

  const decreaseCart = async (itemId) => {
    try {
      const updatedCart = await decreaseCartApi(itemId);
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to decrease quantity:", error);
    }
    fetchCart();
  };

  const removeCart = async (itemId) => {
    try {
      const updatedCart = await removeCartApi(itemId);
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const clearCart = async () => {
    try {
      await clearCartApi();

      setCart({
        items: [],
        total: 0,
        total_items: 0,
      });
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addCart,
        increaseCart,
        decreaseCart,
        removeCart,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
