import axios from "axios";
import { BASE_URL } from "./apiPaths.js";

const AUTH_PUBLIC_PATHS = ["/api/auth/login", "/api/auth/register"];

export const toServiceError = (error, fallbackMessage) => {
  const payload = error.response?.data;
  return {
    ...(payload || {}),
    message: payload?.error || payload?.message || fallbackMessage,
  };
};

export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return false;
    return payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 80000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const requestUrl = config.url || "";
    const isPublicAuth = AUTH_PUBLIC_PATHS.some((path) => requestUrl.includes(path));
    const accessToken = localStorage.getItem("token");

    if (accessToken && isTokenExpired(accessToken)) {
      clearSession();
    } else if (accessToken && !isPublicAuth) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (config.data instanceof FormData) {
      if (typeof config.headers?.delete === "function") {
        config.headers.delete("Content-Type");
      } else {
        delete config.headers["Content-Type"];
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";
    const isPublicAuth = AUTH_PUBLIC_PATHS.some((path) => requestUrl.includes(path));

    if (status === 401 && !isPublicAuth) {
      clearSession();
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    } else if (status === 500) {
      console.error("server error. Please try again later.");
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout. Please try again later.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

