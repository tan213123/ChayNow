import apiService from "@/services/api.service";
import type {
  ApiResponse,
  LoginApiData,
  LoginRequest,
  LoginResponse,
} from "@/types/auth";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiService.post<
    ApiResponse<LoginApiData>,
    ApiResponse<LoginApiData>
  >("api/auth/login", data);

  if (!response.success) {
    throw new Error(response.message || "Login failed");
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
