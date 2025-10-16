import api from "./apiClient";

const trackingService = {
  list: async (status) => {
    const url = status ? `/tracking?status=${status}` : "/tracking";
    return (await api.get(url)).data.data;
  },
  getTracking: async (orderId) =>
    (await api.get(`/tracking/${orderId}`)).data.data,
  upsert: async (tracking) => (await api.post("/tracking", tracking)).data.data,
  remove: async (orderId) =>
    (await api.delete(`/tracking/${orderId}`)).data.data,
};

export default trackingService;
