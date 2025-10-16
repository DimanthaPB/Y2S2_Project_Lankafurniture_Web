const API_BASE_URL = 'http://localhost:5001/api';

export const ENDPOINTS = {
  PROJECTS: {
    PROVIDER: (providerId) => `${API_BASE_URL}/projects/provider/${providerId}`,
    CREATE: () => `${API_BASE_URL}/projects`,
    BY_ID: (id) => `${API_BASE_URL}/projects/${id}`,
  },
  TRANSACTIONS: {
    PROVIDER: (providerId) => `${API_BASE_URL}/transactions/${providerId}`,
  },
  RATINGS: {
    PROVIDER: (providerId) => `${API_BASE_URL}/ratings/provider/${providerId}`,
  },
  JOBS: {
    NEW: () => `${API_BASE_URL}/jobs/new`,
    ALL: () => `${API_BASE_URL}/jobs`,
    BY_ID: (id) => `${API_BASE_URL}/jobs/${id}`
  }
};

// Add user endpoints
ENDPOINTS.USERS = {
  ALL: () => `${API_BASE_URL}/users`,
  BY_ID: (id) => `${API_BASE_URL}/users/${id}`,
};

export default {
  API_BASE_URL,
  ENDPOINTS,
};
