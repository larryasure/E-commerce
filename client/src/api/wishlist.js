import axiosInstance from "../api/axiosConfig.js"

export const getWishlist = async () => {
  const response = await axiosInstance.get("wishlist/")
  return response.data
}


export const addWishlist = async (productId) => {
  const response = await axiosInstance.post("wishlist/", {
    product_id: productId
  })

  return response.data
} 


export const removeWishlist = async (wishlistId) => {
  await axiosInstance.delete(`wishlist/${wishlistId}/`)
}