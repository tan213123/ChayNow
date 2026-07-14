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

export type RestaurantStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface AdminRestaurant {
  id: number;
  name: string;
  address?: string | null;
  thumbnailUrl?: string | null;
  rating?: number | null;
  reviewCount: number;
  status: RestaurantStatus;
  placeId?: number | null;
  placeName?: string | null;
  ownerId?: number | null;
  ownerName?: string | null;
  createdAt: string;
}

export interface AdminRestaurantsResponse {
  content: AdminRestaurant[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface FetchRestaurantsParams {
  page?: number;
  size?: number;
  keyword?: string;
  status?: RestaurantStatus | "ALL";
  placeId?: number | "ALL";
}

export const getAdminRestaurants = async (
  params: FetchRestaurantsParams,
): Promise<AdminRestaurantsResponse> => {
  const queryParams: Record<string, string | number> = {};

  if (params.page !== undefined) queryParams.page = params.page;
  if (params.size !== undefined) queryParams.size = params.size;
  if (params.keyword && params.keyword.trim() !== "") {
    queryParams.keyword = params.keyword.trim();
  }
  if (params.status && params.status !== "ALL") queryParams.status = params.status;
  if (params.placeId && params.placeId !== "ALL") queryParams.placeId = params.placeId;

  const response = await apiService.get<
    MaybeWrapped<AdminRestaurantsResponse>,
    MaybeWrapped<AdminRestaurantsResponse>
  >("/api/admin/restaurants", { params: queryParams });

  return unwrapResponse(response);
};

export const approveRestaurant = async (id: number): Promise<unknown> => {
  return apiService.patch<unknown, unknown>(`/api/admin/restaurants/${id}/approve`);
};

export const rejectRestaurant = async (
  id: number,
  reason: string,
): Promise<unknown> => {
  return apiService.patch<unknown, unknown>(
    `/api/admin/restaurants/${id}/reject`,
    { reason },
  );
};
