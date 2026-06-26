import apiService from "@/services/api.service";
import type {
  ApiResponse,
  PageResponse,
  FavouritePlaceResponse,
} from "@/types/restaurant";

/**
 * Thêm một nhà hàng vào danh sách yêu thích của người dùng hiện tại.
 * @param restaurantId ID của nhà hàng cần lưu
 */
export const addFavourite = async (
  restaurantId: number,
): Promise<ApiResponse<void>> =>
  apiService.post<ApiResponse<void>, ApiResponse<void>>(
    `/api/favourites/restaurants/${restaurantId}`,
  );

/**
 * Xóa một nhà hàng khỏi danh sách yêu thích của người dùng hiện tại.
 * @param restaurantId ID của nhà hàng cần xóa
 */
export const removeFavourite = async (
  restaurantId: number,
): Promise<ApiResponse<void>> =>
  apiService.delete<ApiResponse<void>, ApiResponse<void>>(
    `/api/favourites/restaurants/${restaurantId}`,
  );

/**
 * Lấy danh sách các nhà hàng yêu thích của người dùng hiện tại (hỗ trợ phân trang).
 * @param page Số trang cần lấy (bắt đầu từ 0)
 * @param size Số phần tử mỗi trang (tối đa 50)
 */
export const getFavourites = async (
  page: number = 0,
  size: number = 10,
): Promise<ApiResponse<PageResponse<FavouritePlaceResponse>>> =>
  apiService.get<
    ApiResponse<PageResponse<FavouritePlaceResponse>>,
    ApiResponse<PageResponse<FavouritePlaceResponse>>
  >("/api/favourites/restaurants", {
    params: { page, size },
  });

/**
 * Kiểm tra xem một nhà hàng đã được người dùng hiện tại yêu thích hay chưa.
 * @param restaurantId ID của nhà hàng cần kiểm tra
 */
export const isFavourite = async (
  restaurantId: number,
): Promise<ApiResponse<boolean>> =>
  apiService.get<ApiResponse<boolean>, ApiResponse<boolean>>(
    `/api/favourites/restaurants/${restaurantId}/status`,
  );
