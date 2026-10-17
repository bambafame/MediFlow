import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8090/api",

  headers: {
    "Content-Type": "application/json",
  },
});

/*
 * Attach JWT to every request when available.
 */
api.interceptors.request.use(
  (config) => {
    const storedAuth = localStorage.getItem("mediflow_auth");

    if (storedAuth) {
      try {
        const auth = JSON.parse(storedAuth);

        if (auth?.token) {
          config.headers.Authorization = `Bearer ${auth.token}`;
        }
      } catch {
        localStorage.removeItem("mediflow_auth");
      }
    }

    return config;
  },

  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("mediflow_auth");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
