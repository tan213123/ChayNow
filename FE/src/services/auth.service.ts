import apiService from "@/services/api.service";
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  TokenApiData,
} from "@/types/auth";

const toLoginResponse = (data: TokenApiData): LoginResponse => ({
  accessToken: data.accessToken,
  user: {
    email: data.email,
    fullName: data.fullName,
    role: data.role,
    status: "ACTIVE",
    avatarUrl: null,
  },
});

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiService.post<
    ApiResponse<TokenApiData>,
    ApiResponse<TokenApiData>
  >("/api/v1/auth/login", data);

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
  >("/api/v1/auth/register", data);

  if (!response.success) {
    throw new Error(response.message || "Registration failed");
  }

  return toLoginResponse(response.data);
};
