import { createContext, useContext, useEffect, useState } from "react";
import { getCart } from "../utils/cart.js";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await getCart();
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
      const updatedCart = await addCart(productId, 1);
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to add quantity:", error);
    }
  };

  const increaseCart = async (id) => {
    try {
      const updatedCart = await increaseCart(id);
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to increase quantity:", error);
    }
  };

  const decreaseCart = async (id) => {
    try {
      const updatedCart = await decreaseCart(id);
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to decrease quantity:", error);
    }
  };

  const removeCart = async (id) => {
    try {
      await removeCart();
      setCart((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to removeCart:", error);
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
        refreshCart:fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
