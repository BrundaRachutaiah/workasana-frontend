import axios from "axios";

const EXPLICIT_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const DEFAULT_LOCAL_BASE_URL = "http://localhost:5000";
// If VITE_API_BASE_URL is missing in production, the app would otherwise try to
// call localhost and actions like "Create Project" look like they do nothing.
// This default matches the typical Vercel backend project name in this repo.
const DEFAULT_PROD_BASE_URL = "https://workasana-backend.vercel.app";

export const API_BASE_URL =
  EXPLICIT_BASE_URL ||
  (import.meta.env.DEV ? DEFAULT_LOCAL_BASE_URL : DEFAULT_PROD_BASE_URL);

if (import.meta.env.DEV) {
  // Helps debug "why am I still hitting the deployed backend?" issues
  console.info("[api] baseURL =", API_BASE_URL);
}

if (!import.meta.env.DEV && !EXPLICIT_BASE_URL) {
  console.warn(
    `[api] VITE_API_BASE_URL is not set; defaulting to ${API_BASE_URL}. ` +
      "Set VITE_API_BASE_URL in your Vercel project env vars to avoid misrouting."
  );
}

const api = axios.create({ baseURL: API_BASE_URL });

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
