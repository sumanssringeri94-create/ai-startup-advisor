
// src/services/api.js

import axios from "axios";

/* =========================
   AXIOS INSTANCE
========================= */
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

/* =========================
   ATTACH JWT TOKEN
========================= */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* =========================
   AUTH API
========================= */
export const authAPI = {
  signup: async (data) => {
    const response = await api.post("/auth/signup", data);
    return response.data;
  },

  login: async (data) => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  me: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

/* =========================
   STARTUP API
========================= */
export const startupAPI = {
  create: async (data) => {
    const response = await api.post("/startup", data);
    return response.data;
  },

  get: async (userId) => {
    const response = await api.get(`/startup/${userId}`);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/startup/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/startup/${id}`);
    return response.data;
  },
};

/* =========================
   CHAT API
========================= */
export const chatAPI = {
  send: async (data) => {
    const response = await api.post("/chat", data);
    return response.data;
  },

  history: async (userId) => {
    const response = await api.get(`/chat/history/${userId}`);
    return response.data;
  },

  save: async (data) => {
    const response = await api.post("/chat/save", data);
    return response.data;
  },
};

/* =========================
   ANALYTICS API
========================= */
export const analyticsAPI = {
  get: async (userId) => {
    const response = await api.get(`/analytics/${userId}`);
    return response.data;
  },
};

export default api;
