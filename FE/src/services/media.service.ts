import apiService from "@/services/api.service";
import type { ApiResponse, MediaResponse } from "@/types/restaurant";

export const mediaService = {
  upload: async (
    file: File,
    restaurantId?: number,
    reviewId?: number,
  ): Promise<ApiResponse<MediaResponse>> => {
    const formData = new FormData();
    formData.append("file", file);
    if (restaurantId !== undefined) {
      formData.append("restaurantId", restaurantId.toString());
    }
    if (reviewId !== undefined) {
      formData.append("reviewId", reviewId.toString());
    }

    return apiService.post<ApiResponse<MediaResponse>, ApiResponse<MediaResponse>>(
      "/api/media/upload",
      formData,
    );
  },

  uploadMultiple: async (
    files: File[],
    restaurantId?: number,
    reviewId?: number,
  ): Promise<ApiResponse<MediaResponse[]>> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    if (restaurantId !== undefined) {
      formData.append("restaurantId", restaurantId.toString());
    }
    if (reviewId !== undefined) {
      formData.append("reviewId", reviewId.toString());
    }

    return apiService.post<ApiResponse<MediaResponse[]>, ApiResponse<MediaResponse[]>>(
      "/api/media/upload-multiple",
      formData,
    );
  },
};
