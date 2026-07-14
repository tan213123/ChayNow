import apiService from "@/services/api.service";
import type {
  ApiResponse,
  CreateMenuRequest,
  MenuResponse,
  UpdateMenuRequest,
} from "@/types/restaurant";

export const getMenus = async (): Promise<MenuResponse[]> =>
  apiService.get<MenuResponse[], MenuResponse[]>("/api/menus");

export const getRestaurantMenus = async (
  restaurantId: number,
): Promise<MenuResponse[]> =>
  apiService.get<MenuResponse[], MenuResponse[]>(
    `/api/restaurants/${restaurantId}/menus`,
  );

export const getMenu = async (menuId: number): Promise<MenuResponse> =>
  apiService.get<MenuResponse, MenuResponse>(`/api/menus/${menuId}`);

export const createMenu = async (
  restaurantId: number,
  data: CreateMenuRequest,
): Promise<MenuResponse> =>
  apiService.post<MenuResponse, MenuResponse>(
    `/api/restaurants/${restaurantId}/menus`,
    data,
  );

export const updateMenu = async (
  menuId: number,
  data: UpdateMenuRequest,
): Promise<MenuResponse> =>
  apiService.patch<MenuResponse, MenuResponse>(`/api/menus/${menuId}`, data);

export const deleteMenu = async (
  menuId: number,
): Promise<ApiResponse<void>> =>
  apiService.delete<ApiResponse<void>, ApiResponse<void>>(
    `/api/menus/${menuId}`,
  );
