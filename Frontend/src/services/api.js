import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Authentication APIs
export const authAPI = {
  login: (data) => API.post("/auth/login", data),
  signup: (data) => API.post("/auth/signup", data),
};

// Startup APIs
export const startupAPI = {
  getStartup: (id) => API.get(`/startup/${id}`),
  createStartup: (data) => API.post("/startup/create", data),
};

// Chat APIs
export const chatAPI = {
  saveChat: (data) => API.post("/chat/save", data),
  getHistory: (id) => API.get(`/chat/history/${id}`),
};

export default API;