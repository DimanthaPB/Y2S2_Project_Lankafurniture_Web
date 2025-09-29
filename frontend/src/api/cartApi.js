import axiosInstance from "./axiosInstant";

export const getCart = async () => {
  const response = await axiosInstance.get('/cart');
  return response.data;
};

export const addToCart = async (itemId, quantity) => {
  const response = await axiosInstance.post('/cart/add', { itemId, quantity });
  return response.data;
};

export const updateCartItem = async (itemId, quantity) => {
  const response = await axiosInstance.put('/cart/update', { itemId, quantity });
  return response.data;
};

export const removeFromCart = async (itemId) => {
  const response = await axiosInstance.delete(`/cart/remove/${itemId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await axiosInstance.delete('/cart/clear');
  return response.data;
};