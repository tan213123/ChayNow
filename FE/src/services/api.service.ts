import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

import { useAuthStore } from "@/store/authStore";

const getStringMessages = (value: unknown): string[] => {
  if (typeof value === "string") {
    const message = value.trim();
    return message ? [message] : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap(getStringMessages);
  }

  if (value && typeof value === "object") {
    return Object.values(value).flatMap(getStringMessages);
  }

  return [];
};

export const getApiErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  if (error && typeof error === "object") {
    const response = Reflect.get(error, "response");
    const responseData =
      response && typeof response === "object"
        ? Reflect.get(response, "data")
        : undefined;

    if (responseData && typeof responseData === "object") {
      const validationMessages = getStringMessages(
        Reflect.get(responseData, "data"),
      );

      if (validationMessages.length > 0) {
        return validationMessages.join(". ");
      }

      const backendMessage = Reflect.get(responseData, "message");
      if (typeof backendMessage === "string" && backendMessage.trim()) {
        return backendMessage.trim();
      }

      const legacyError = Reflect.get(responseData, "error");
      if (typeof legacyError === "string" && legacyError.trim()) {
        return legacyError.trim();
      }
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }

  return fallback;
};

const config: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

const apiService: AxiosInstance = axios.create(config);

const publicEndpoints = ["/api/auth/login", "/api/auth/register"];

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

  (error: AxiosError<unknown>) => {
    if (!error.response) {
      console.error("Network Error:", error.message);
      return Promise.reject(error);
    }

    const status = error.response.status;

    const backendMessage = getApiErrorMessage(error, error.message);

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
