import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    console.error("VITE_API_URL is not configured.");
}

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 15000,
});

// Attach JWT automatically to every request
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

// Handle authentication and network errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }

        if (!error.response) {
            console.error("Network error:", error.message);
        }

        return Promise.reject(error);
    }
);

export default api;