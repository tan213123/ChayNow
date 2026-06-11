import apiService from "@/services/api.service";
import type { Role, AccountStatus } from "@/types/auth";

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

export const getAdminUsers = async (params: FetchUsersParams): Promise<AdminUsersResponse> => {
  const queryParams: Record<string, any> = {};

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

  const response = await apiService.get<any, any>("/api/admin/users", {
    params: queryParams,
  });


  // Support both wrapped in ApiResponse (with success/data fields) and raw response data
  if (response && typeof response === "object" && "data" in response && response.success !== undefined) {
    return response.data;
  }
  return response;
};

export const suspendUser = async (id: number): Promise<any> => {
  const response = await apiService.patch<any, any>(`/api/admin/users/${id}/suspend`);
  return response;
};

export const activeUser = async (id: number): Promise<any> => {
  const response = await apiService.patch<any, any>(`/api/admin/users/${id}/activate`);
  return response;
};

