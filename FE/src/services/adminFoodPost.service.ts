import apiService from "@/services/api.service";

type MaybeWrapped<T> = T | { success?: boolean; message?: string; data: T };

const unwrapResponse = <T>(response: MaybeWrapped<T>): T => {
  if (
    response &&
    typeof response === "object" &&
    "data" in response &&
    "success" in response
  ) {
    return response.data;
  }

  return response as T;
};

export type FoodPostStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface AdminFoodPost {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  restaurantId: string;
  restaurantName: string;
  categoryId: string;
  categoryName: string;
  likesCount: number;
  status: FoodPostStatus;
  createdAt: string;
}

export interface FetchFoodPostsParams {
  keyword?: string;
  categoryId?: string | "ALL";
  status?: FoodPostStatus | "ALL";
  page?: number;
  size?: number;
}

export interface AdminFoodPostsResponse {
  data: AdminFoodPost[];
  pagination?: {
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
  };
}

export const getAdminFoodPosts = async (
  params: FetchFoodPostsParams,
): Promise<AdminFoodPostsResponse> => {
  const queryParams: Record<string, string | number> = {};

  queryParams.page = params.page ?? 0;
  queryParams.size = params.size ?? 10;
  if (params.keyword && params.keyword.trim() !== "") {
    queryParams.keyword = params.keyword.trim();
  }
  if (params.categoryId && params.categoryId !== "ALL") {
    queryParams.categoryId = params.categoryId;
  }
  if (params.status && params.status !== "ALL") queryParams.status = params.status;

  const response = await apiService.get<
    MaybeWrapped<AdminFoodPostsResponse>,
    MaybeWrapped<AdminFoodPostsResponse>
  >("/api/admin/food-posts", { params: queryParams });

  return unwrapResponse(response);
};

export const getAdminFoodPostById = async (
  postId: string,
): Promise<AdminFoodPost> => {
  const response = await apiService.get<
    MaybeWrapped<AdminFoodPost>,
    MaybeWrapped<AdminFoodPost>
  >(`/api/admin/food-posts/${postId}`);

  return unwrapResponse(response);
};

export const approveFoodPost = async (postId: string): Promise<unknown> => {
  return apiService.patch<unknown, unknown>(
    `/api/admin/food-posts/${postId}/approve`,
  );
};

export const rejectFoodPost = async (
  postId: string,
  reason?: string,
): Promise<unknown> => {
  return apiService.patch<unknown, unknown>(
    `/api/admin/food-posts/${postId}/reject`,
    reason ? { reason } : undefined,
  );
};
