const CART_KEY = "cart";

export const getCart = () => {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
};

export const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const addToCart = (product, quantity = 1) => {
  const cart = getCart();

  const existingCart = cart.find((item) => item.id === product.id);

  if (existingCart) {
    existingCart.quantity = Number(existingCart.quantity || 0) + quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
};

export const removeFromCart = (id) => {
  const cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
  return cart;
};

export const clearCart = () => {
  saveCart([]);
};

import axiosInstance from "../api/axiosConfig.js";

const fetchCart = async () => {
  const response = axiosInstance.get("cart/");
  return response.data;
};


