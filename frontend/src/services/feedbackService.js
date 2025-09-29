import api from "./apiClient";

const feedbackService = {
  getAll: async () => (await api.get("/feedback")).data.data,
  getFeedbackByTeam: async (teamId) =>
    (await api.get(`/feedback/team/${teamId}`)).data.data,
  createFeedback: async (fb) => (await api.post("/feedback", fb)).data.data,
};

export default feedbackService;
