import { createContext, useContext, useEffect, useState } from "react";
import { addCartApi, clearCartApi, decreaseCartApi, getCartApi, increaseCartApi, removeCartApi } from "../utils/cart";


const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await getCartApi();
      setCart(data);
    } catch (error) {
      console.error("Error fetching Cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addCart = async (productId) => {
    try {
      const updatedCart = await addCartApi(productId, 1);
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to add quantity:", error);
    }
  };

  const increaseCart = async (id) => {
    try {
      const updatedCart = await increaseCartApi(id);
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to increase quantity:", error);
    }
  };

  const decreaseCart = async (id) => {
    try {
      const updatedCart = await decreaseCartApi(id);
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to decrease quantity:", error);
    }
  };

  const removeCart = async (id) => {
    try {
      await removeCartApi();
      setCart((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to removeCart:", error);
    }
  };


const clearCart = async () => {
  await clearCartApi();

  setCart((prev) => ({
    ...prev,
    items: [],
    total: 0,
    total_items: 0,
  }));
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
        refreshCart:fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
