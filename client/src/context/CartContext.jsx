import { createContext, useContext, useEffect, useState } from "react";
import { getCart } from "../utils/cart";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const refreshCart = () => {
    setCart(getCart());
  };

  useEffect(() => {
    refreshCart();

    window.addEventListener("cartUpdated", refreshCart);

    return () => window.removeEventListener("cartUpdated", refreshCart);
  }, []);

  return (
    <CartContext.Provider value={{ cart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
