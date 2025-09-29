import api from "./apiClient";

const deliveryTeamService = {
  getAll: async () => (await api.get("/delivery-teams")).data.data,
  getById: async (id) => (await api.get(`/delivery-teams/${id}`)).data.data,
  create: async (team) => (await api.post("/delivery-teams", team)).data.data,
  update: async (id, team) =>
    (await api.put(`/delivery-teams/${id}`, team)).data.data,
  remove: async (id) => (await api.delete(`/delivery-teams/${id}`)).data.data,
};

export default deliveryTeamService;
