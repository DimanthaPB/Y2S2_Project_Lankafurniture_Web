import axiosInstance from "./axiosInstant";

export const getItems = async (params = {}) => {
  const response = await axiosInstance.get('/items', { params });
  return response.data;
};

export const getItemById = async (id) => {
  const response = await axiosInstance.get(`/items/${id}`);
  return response.data;
};

export const createItem = async (itemData) => {
  const response = await axiosInstance.post('/items', itemData);
  return response.data;
};

export const updateItem = async (id, itemData) => {
  const response = await axiosInstance.put(`/items/${id}`, itemData);
  return response.data;
};

export const deleteItem = async (id) => {
  const response = await axiosInstance.delete(`/items/${id}`);
  return response.data;
};

export const getLowStockItems = async () => {
  const response = await axiosInstance.get('/items/low-stock');
  return response.data;
};

export const getItemReportSummary = async () => {
  const response = await axiosInstance.get('/items/report');
  return response.data;
};

export const getSalesData = async () => {
  const response = await axiosInstance.get('/items/sales');
  return response.data;
};