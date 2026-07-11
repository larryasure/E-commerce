import axiosInstance from "../api/axiosConfig.js";

export const getCartApi = async () => {
  const response = await axiosInstance.get("cart/");
  return response.data;
};

export const addCartApi = async (productId, quantity = 1) => {
  const response = await axiosInstance.post("cart/add/", {
    product_id: productId,
    quantity,
  });

  return response.data;
};

export const increaseCartApi = async (itemId) => {
  const response = await axiosInstance.patch(`cart/${itemId}/increase/`);
  return response.data;
};

export const decreaseCartApi = async (itemId) => {
  const response = await axiosInstance.patch(`cart/${itemId}decrease/`);
  return response.data;
};

export const removeCartApi = async (itemId) => {
  const response = await axiosInstance.delete(`cart/${itemId}/remove/`);
  return response.data;
};


export const clearCartApi = async () => {
  await axiosInstance.delete(`cart/clear/`)
}