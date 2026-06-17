import apiService from "@/services/api.service";
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "@/types/auth";

const toLoginResponse = (data: TokenApiData): LoginResponse => ({
  accessToken: data.accessToken,
  user: {
    id: data.id,
    email: data.email,
    fullName: data.fullName,
    role: data.role,
    status: data.status,
    avatarUrl: data.avtUrl,
  },
});

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiService.post<
    ApiResponse<TokenApiData>,
    ApiResponse<TokenApiData>
  >("/api/auth/login", data);

  if (!response.success) {
    throw new Error(response.message || "Login failed");
  }

  return toLoginResponse(response.data);
};

export const register = async (
  data: RegisterRequest,
): Promise<LoginResponse> => {
  const response = await apiService.post<
    ApiResponse<TokenApiData>,
    ApiResponse<TokenApiData>
  >("/api/auth/register", data);

  if (!response.success) {
    throw new Error(response.message || "Registration failed");
  }

  return toLoginResponse(response.data);
};

export const register = async (data: RegisterRequest): Promise<LoginResponse> => {
  const response = await apiService.post<
    ApiResponse<LoginApiData>,
    ApiResponse<LoginApiData>
  >("api/auth/register", data);

  if (!response.success) {
    throw new Error(response.message || "Registration failed");
  }

  return {
    accessToken: response.data.accessToken,
    user: {
      id: response.data.id,
      email: response.data.email,
      fullName: response.data.fullName,
      role: response.data.role,
      status: response.data.status,
      avatarUrl: response.data.avtUrl,
    },
  };
};
