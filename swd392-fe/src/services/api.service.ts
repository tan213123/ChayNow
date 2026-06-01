import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";

const config: AxiosRequestConfig = {
  baseURL:
    "https://e5a6-2405-4803-ccdd-f6f0-c0b5-aaf6-31a0-74a4.ngrok-free.app/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

const apiService: AxiosInstance = axios.create(config);

//INTERCEPTORS
apiService.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Let the browser set Content-Type automatically for FormData (multipart + boundary)
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiService.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // Extract the backend message
      const backendMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        error.message;
      switch (error.response.status) {
        case 400:
          console.error("Bad Request:", backendMessage);
          break;
        case 401:
          console.error(
            "Unauthorized - token may be invalid or expired:",
            backendMessage,
          );
          localStorage.removeItem("access_token");
          break;
        case 403:
          console.error(
            "Forbidden - insufficient permissions:",
            backendMessage,
          );
          break;
        case 500:
          console.error("Server error:", backendMessage);
          break;
        default:
          console.error("Unexpected error:", error.response.status);
      }
      // Reject with an Error that carries the backend message
      return Promise.reject(new Error(backendMessage));
    }
    return Promise.reject(error);
  },
);

export default apiService;
