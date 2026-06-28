import apiService from "@/services/api.service";
import type { ApiResponse, UserProfileResponse } from "@/types/auth";

export const getMyProfile = async (): Promise<UserProfileResponse> => {
  const response = await apiService.get<
    ApiResponse<UserProfileResponse>,
    ApiResponse<UserProfileResponse>
  >("/api/users/profile");

  if (!response.success) {
    throw new Error(response.message || "Failed to fetch profile");
  }

  return response.data;
};

export interface UpdateProfileRequest {
  fullName?: string;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
}

export const updateMyProfile = async (
  data: UpdateProfileRequest
): Promise<UserProfileResponse> => {
  const response = await apiService.put<
    ApiResponse<UserProfileResponse>,
    ApiResponse<UserProfileResponse>
  >("/api/users/profile", data);

  if (!response.success) {
    throw new Error(response.message || "Failed to update profile");
  }

  return response.data;
};
