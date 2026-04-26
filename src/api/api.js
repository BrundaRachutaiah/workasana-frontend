import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

if (import.meta.env.DEV) {
  // Helps debug "why am I still hitting the deployed backend?" issues
  console.info("[api] baseURL =", API_BASE_URL);
}

const api = axios.create({ baseURL: API_BASE_URL });

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
