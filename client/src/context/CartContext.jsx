import { createContext, useContext, useEffect, useState } from "react";
import { getCart, saveCart } from "../utils/cart";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const refreshCart = () => {
      setCart(getCart());
    };

    refreshCart();

    window.addEventListener("cartUpdated", refreshCart);
    return () => window.removeEventListener("cartUpdated", refreshCart);
  }, [setCart]);

  const addCart = (product) => {
    const currentCart = getCart();

    let updatedCart;
    const existingCart = currentCart.find((item) => item.id === product.id);

    if (existingCart) {
      updatedCart = currentCart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
    } else {
      updatedCart = [...currentCart, { ...product, quantity: 1 }];
    }

    saveCart(updatedCart);
    setCart(updatedCart);
  };

  const increaseCart = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
    );

    saveCart(updatedCart);
    setCart(updatedCart);
  };

  const decreaseCart = (id) => {
    let updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
    );

    updatedCart = updatedCart.filter((item) => item.quantity > 0);

    saveCart(updatedCart);
    setCart(updatedCart);
  };

  const removeCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);

    saveCart(updatedCart);
    setCart(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addCart,
        increaseCart,
        decreaseCart,
        removeCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// export const useCart = useContext(CartContext)

export const useCart = () => useContext(CartContext);
