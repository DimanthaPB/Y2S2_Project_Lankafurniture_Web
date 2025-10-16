import api from "./apiClient";

const teamService = {
    getAll: async () => (await api.get("/teams")).data.data,
    getById: async (id) => (await api.get(`/teams/${id}`)).data.data,
    // Using members endpoint as fallback if teams endpoint doesn't exist
    getAllMembers: async () => (await api.get("/members")).data.data,
};

export default teamService;
