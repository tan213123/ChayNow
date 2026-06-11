import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

import { useAuthStore } from "@/store/authStore";

const config: AxiosRequestConfig = {
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  },
};

const apiService: AxiosInstance = axios.create(config);

const publicEndpoints = ["/auth/login", "/auth/register"];

const isPublicEndpoint = (url?: string) => {
  if (!url) {
    return false;
  }

  return publicEndpoints.some((endpoint) => url.includes(endpoint));
};

/**
 * REQUEST INTERCEPTOR
 */
apiService.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken && !isPublicEndpoint(config.url)) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * RESPONSE INTERCEPTOR
 */
apiService.interceptors.response.use(
  (response) => response.data,

  (error: AxiosError<any>) => {
    if (!error.response) {
      console.error("Network Error:", error.message);
      return Promise.reject(error);
    }

    const status = error.response.status;

    const backendMessage =
      error.response.data?.message ||
      error.response.data?.error ||
      error.message;

    switch (status) {
      case 400:
        console.error("Bad Request:", backendMessage);
        break;

      case 401:
        console.error("Unauthorized:", backendMessage);

        // Logout khỏi Zustand
        useAuthStore.getState().logout();

        break;

      case 403:
        console.error("Forbidden:", backendMessage);
        break;

      case 404:
        console.error("Not Found:", backendMessage);
        break;

      case 500:
        console.error("Internal Server Error:", backendMessage);
        break;

      default:
        console.error(`HTTP ${status}:`, backendMessage);
    }

    /**
     * Giữ nguyên AxiosError
     * Chỉ overwrite message, UI hiển thị đẹp hơn
     */
    error.message = backendMessage;

    return Promise.reject(error);
  },
);

export default apiService;
