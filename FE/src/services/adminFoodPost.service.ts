import apiService from "@/services/api.service";

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
  if (params.status && params.status !== "ALL") queryParams.status = params.status;
  
  queryParams.type = "COMMUNITY";

  // Gọi chung API postings
  const response = await apiService.get<any, any>("/api/admin/postings", { params: queryParams });
  const rawData = response.data || response;

  const content = rawData.content || [];
  
  const mappedData: AdminFoodPost[] = content.map((item: any) => ({
    id: item.id.toString(),
    title: item.title,
    description: item.content || "",
    imageUrl: item.thumbnailUrl || "",
    restaurantId: item.restaurantId?.toString() || "",
    restaurantName: item.restaurantName || "",
    categoryId: item.category || "",
    categoryName: item.category || "",
    likesCount: item.likeCount || 0,
    status: item.status as FoodPostStatus,
    createdAt: item.createdAt,
  }));

  return {
    data: mappedData,
    pagination: {
      page: rawData.page,
      size: rawData.size,
      totalItems: rawData.totalElements,
      totalPages: rawData.totalPages,
    }
  };
};

export const getAdminFoodPostById = async (
  postId: string,
): Promise<AdminFoodPost> => {
  const response = await apiService.get<any, any>(`/api/admin/postings/${postId}`);
  const item = response.data || response;
  return {
    id: item.id.toString(),
    title: item.title,
    description: item.content || "",
    imageUrl: item.thumbnailUrl || "",
    restaurantId: item.restaurantId?.toString() || "",
    restaurantName: item.restaurantName || "",
    categoryId: item.category || "",
    categoryName: item.category || "",
    likesCount: item.likeCount || 0,
    status: item.status as FoodPostStatus,
    createdAt: item.createdAt,
  };
};

export const approveFoodPost = async (postId: string): Promise<unknown> => {
  return apiService.patch<unknown, unknown>(
    `/api/admin/postings/${postId}/approve`,
  );
};

export const rejectFoodPost = async (
  postId: string,
  reason?: string,
): Promise<unknown> => {
  return apiService.patch<unknown, unknown>(
    `/api/admin/postings/${postId}/reject`,
    { reason: reason || "" },
  );
};
