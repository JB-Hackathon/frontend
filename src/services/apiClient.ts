import { clearTokens, getAccessToken } from "@/utils/storage";
import axios from "axios";
import { getNewTokens } from "./auth/token";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

const defaultConfig = {
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};

// 인증이 필요없는 요청 (로그인, 회원가입 등)
export const client = axios.create(defaultConfig);

// 인증이 필요한 요청
export const authClient = axios.create(defaultConfig);

authClient.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

authClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await getNewTokens();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return authClient(originalRequest);
      } catch {
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default client;