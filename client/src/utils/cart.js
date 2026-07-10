import axiosInstance from "../api/axiosConfig.js";

export const getCart = async () => {
  const response = await axiosInstance.get("cart/");
  return response.data;
};

export const addCart = async (productId, quantity = 1) => {
  const response = await axiosInstance.post("cart/add/", {
    product_id: productId,
    quantity,
  });

  return response.data;
};

export const increaseCart = async (itemId) => {
  const response = await axiosInstance.patch(`cart/${itemId}/increase/`);
  return response.data;
};

export const decreaseCart = async (itemId) => {
  const response = await axiosInstance.patch(`cart/${itemId}decrease/`);
  return response.data;
};

export const removeCart = async (itemId) => {
  const response = await axiosInstance.delete(`cart/${itemId}/remove/`);
  return response.data;
};
