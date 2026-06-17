import apiService from "@/services/api.service";

type MaybeWrapped<T> = T | { success?: boolean; data: T };

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

export type PostingStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface AdminPosting {
  id: number;
  name: string;
  restaurantName?: string;
  restaurantId?: number;
  type?: string;
  description?: string;
  image?: string;
  imageUrl?: string;
  createdDate?: string;
  createdAt?: string;
  status: PostingStatus;
  rejectReason?: string;
}

export interface AdminPostingsResponse {
  content: AdminPosting[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface FetchPostingsParams {
  page?: number;
  size?: number;
  keyword?: string;
  status?: PostingStatus | "ALL";
}

export const getAdminPostings = async (
  params: FetchPostingsParams,
): Promise<AdminPostingsResponse> => {
  const queryParams: Record<string, string | number> = {};

  if (params.page !== undefined) queryParams.page = params.page;
  if (params.size !== undefined) queryParams.size = params.size;
  if (params.keyword && params.keyword.trim() !== "") {
    queryParams.keyword = params.keyword.trim();
  }
  if (params.status && params.status !== "ALL") queryParams.status = params.status;

  const response = await apiService.get<
    MaybeWrapped<AdminPostingsResponse>,
    MaybeWrapped<AdminPostingsResponse>
  >("/api/admin/postings", { params: queryParams });

  return unwrapResponse(response);
};

export const approvePosting = async (id: number): Promise<unknown> => {
  return apiService.patch<unknown, unknown>(`/api/admin/postings/${id}/approve`);
};

export const rejectPosting = async (
  id: number,
  reason: string,
): Promise<unknown> => {
  return apiService.patch<unknown, unknown>(
    `/api/admin/postings/${id}/reject`,
    { reason },
  );
};

export {
  getAdminPostings as getAdminPosts,
  approvePosting as approvePost,
  rejectPosting as rejectPost,
};

export type {
  AdminPosting as AdminPost,
  AdminPostingsResponse as AdminPostsResponse,
  FetchPostingsParams as FetchPostsParams,
};
