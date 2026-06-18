import apiService from "@/services/api.service";
import type { AccountStatus, Role } from "@/types/auth";

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

export interface CreateAdminAccountPayload {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

export const getAdminUsers = async (
  params: FetchUsersParams,
): Promise<AdminUsersResponse> => {
  const queryParams: Record<string, string | number> = {};

  if (params.page !== undefined) queryParams.page = params.page;
  if (params.size !== undefined) queryParams.size = params.size;
  if (params.keyword && params.keyword.trim() !== "") {
    queryParams.keyword = params.keyword.trim();
  }
  if (params.role && params.role !== "ALL") queryParams.role = params.role;
  if (params.status && params.status !== "ALL") queryParams.status = params.status;

  const response = await apiService.get<
    MaybeWrapped<AdminUsersResponse>,
    MaybeWrapped<AdminUsersResponse>
  >("/api/admin/users", { params: queryParams });

  return unwrapResponse(response);
};

export const suspendUser = async (id: number): Promise<unknown> => {
  return apiService.patch<unknown, unknown>(`/api/admin/users/${id}/suspend`);
};

export const activeUser = async (id: number): Promise<unknown> => {
  return apiService.patch<unknown, unknown>(`/api/admin/users/${id}/activate`);
};

export const createAdminAccount = async (
  payload: CreateAdminAccountPayload,
): Promise<unknown> => {
  return apiService.post<unknown, unknown>("/api/admin/create", payload);
};
