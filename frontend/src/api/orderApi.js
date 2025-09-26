import axiosInstance from "./axiosInstant";

export const createOrder = async (orderData) => {
  const response = await axiosInstance.post('/orders', orderData);
  return response.data;
};

export const createSingleItemOrder = async (orderData) => {
  const response = await axiosInstance.post('/orders/single-item', orderData);
  return response.data;
};

export const getUserOrders = async () => {
  const response = await axiosInstance.get('/orders');
  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await axiosInstance.get(`/orders/${orderId}`);
  return response.data;
};

export const cancelOrder = async (orderId) => {
  const response = await axiosInstance.put(`/orders/${orderId}/cancel`);
  return response.data;
};

export const deleteOrder = async (orderId) => {
  const response = await axiosInstance.delete(`/orders/${orderId}`);
  return response.data;
};

// Admin functions
export const getAllOrders = async (status) => {
  const params = status ? { status } : {};
  const response = await axiosInstance.get('/orders/admin/all', { params });
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await axiosInstance.put(`/orders/admin/${orderId}/status`, { status });
  return response.data;
};