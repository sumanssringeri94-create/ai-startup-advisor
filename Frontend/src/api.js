// src/services/api.js
// ─────────────────────────────────────────────
// Centralised Axios instance — all API calls go through here.
// Automatically attaches the JWT token from localStorage.
// ─────────────────────────────────────────────

import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

// Create a reusable axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor: inject JWT token before every request ────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 globally ─────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear storage and send to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ── Auth endpoints ────────────────────────────────────────────────────────────
export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login:  (data) => api.post("/auth/login", data),
  getMe:  ()     => api.get("/auth/me"),
};

// ── Startup endpoints ─────────────────────────────────────────────────────────
export const startupAPI = {
  create: (data)       => api.post("/startup/create", data),
  get:    (userId)     => api.get(`/startup/${userId}`),
  update: (id, data)   => api.put(`/startup/update/${id}`, data),
};

// ── Chat endpoints ────────────────────────────────────────────────────────────
export const chatAPI = {
  save:       (data)   => api.post("/chat/save", data),
  getHistory: (userId) => api.get(`/chat/history/${userId}`),
  clear:      ()       => api.delete("/chat/clear"),
};

export default api;
