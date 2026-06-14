import apiService from "@/services/api.service";
import type { ApiResponse, Role, AccountStatus } from "@/types/auth";

export interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  role: Role;
  status: AccountStatus;
  reviewCount: number;
  joinedDate: string;
}

export interface AdminUsersResponse {
  content: AdminUser[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface FetchUsersParams {
  page?: number;
  size?: number;
  keyword?: string;
  role?: Role | "ALL";
  status?: AccountStatus | "ALL";
}

type AdminUsersApiResponse = AdminUsersResponse | ApiResponse<AdminUsersResponse>;

const isWrappedResponse = (
  response: AdminUsersApiResponse,
): response is ApiResponse<AdminUsersResponse> =>
  "success" in response && "data" in response;

export const getAdminUsers = async (params: FetchUsersParams): Promise<AdminUsersResponse> => {
  const queryParams: Record<string, string | number> = {};

  if (params.page !== undefined) {
    queryParams.page = params.page;
  }
  if (params.size !== undefined) {
    queryParams.size = params.size;
  }
  if (params.keyword && params.keyword.trim() !== "") {
    queryParams.keyword = params.keyword.trim();
  }
  if (params.role && params.role !== "ALL") {
    queryParams.role = params.role;
  }
  if (params.status && params.status !== "ALL") {
    queryParams.status = params.status;
  }

  const response = await apiService.get<unknown, AdminUsersApiResponse>("/api/admin/users", {
    params: queryParams,
  });

  return isWrappedResponse(response) ? response.data : response;
};

export const suspendUser = async (id: number): Promise<void> => {
  await apiService.patch(`/api/admin/users/${id}/suspend`);
};

export const activeUser = async (id: number): Promise<void> => {
  await apiService.patch(`/api/admin/users/${id}/activate`);
};

