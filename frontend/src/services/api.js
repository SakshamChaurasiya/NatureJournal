import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const authService = {
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
};

export const journalService = {
  createJournal: async (journalData) => {
    const response = await apiClient.post('/journal', journalData);
    return response.data;
  },
  getJournals: async () => {
    const response = await apiClient.get('/journal');
    return response.data;
  },
  analyzeJournal: async (text) => {
    const response = await apiClient.post('/journal/analyze', { text });
    return response.data;
  },
  getInsights: async () => {
    const response = await apiClient.get('/journal/insights');
    return response.data;
  },
};

export default apiClient;
