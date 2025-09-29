import api from "./apiClient";

const memberService = {
  getAll: async () => (await api.get("/members")).data.data,
  getById: async (id) => (await api.get(`/members/${id}`)).data.data,
  create: async (member) => (await api.post("/members", member)).data.data,
  update: async (id, member) =>
    (await api.put(`/members/${id}`, member)).data.data,
  remove: async (id) => (await api.delete(`/members/${id}`)).data.data,
};

export default memberService;
