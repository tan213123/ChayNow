import apiService from "@/services/api.service";
import type {
  ApiResponse,
  CreateRestaurantRequest,
  CreateReviewRequest,
  CreateTypeRestaurantRequest,
  RestaurantResponse,
  ReviewResponse,
  TypeRestaurantResponse,
  UpdateRestaurantRequest,
} from "@/types/restaurant";

// ─────────────────────────────────────────────────────────────
// TYPE RESTAURANT
// ─────────────────────────────────────────────────────────────

/** GET /api/type-restaurant — Lấy tất cả loại nhà hàng */
export const getTypeRestaurants = async (): Promise<
  TypeRestaurantResponse[]
> =>
  apiService.get<TypeRestaurantResponse[], TypeRestaurantResponse[]>(
    "/api/type-restaurant",
  );

/** GET /api/type-restaurant/{id} — Lấy 1 loại nhà hàng */
export const getTypeRestaurant = async (
  typeRestaurantId: number,
): Promise<TypeRestaurantResponse> =>
  apiService.get<TypeRestaurantResponse, TypeRestaurantResponse>(
    `/api/type-restaurant/${typeRestaurantId}`,
  );

/** POST /api/type-restaurant — Tạo loại nhà hàng */
export const createTypeRestaurant = async (
  data: CreateTypeRestaurantRequest,
): Promise<TypeRestaurantResponse> =>
  apiService.post<TypeRestaurantResponse, TypeRestaurantResponse>(
    "/api/type-restaurant",
    data,
  );

// ─────────────────────────────────────────────────────────────
// RESTAURANT — PUBLIC
// ─────────────────────────────────────────────────────────────

/**
 * GET /api/restaurant
 * Lấy danh sách tất cả nhà hàng (không cần auth)
 */
export const getRestaurants = async (): Promise<RestaurantResponse[]> =>
  apiService.get<RestaurantResponse[], RestaurantResponse[]>(
    "/api/restaurant",
  );

/**
 * GET /api/restaurant/{restaurantId}
 * Lấy chi tiết 1 nhà hàng theo ID (không cần auth)
 */
export const getRestaurant = async (
  restaurantId: number,
): Promise<RestaurantResponse> =>
  apiService.get<RestaurantResponse, RestaurantResponse>(
    `/api/restaurant/${restaurantId}`,
  );

// ─────────────────────────────────────────────────────────────
// RESTAURANT — AUTH REQUIRED (OWNER / ADMIN)
// ─────────────────────────────────────────────────────────────

/**
 * POST /api/restaurant
 * Tạo nhà hàng mới — cần đăng nhập (OWNER)
 *
 * @example
 * createRestaurant({
 *   name: "Nhà hàng ABC",
 *   address: "123 Đường ABC",
 *   phoneNumber: "0901234567",
 *   description: "Mô tả",
 *   placeId: 1,
 *   typeRestaurantId: 2,
 *   openTime: "08:00:00",
 *   closedTime: "22:00:00",
 *   mediaUrls: ["http://img1.jpg"],
 * });
 */
export const createRestaurant = async (
  data: CreateRestaurantRequest,
): Promise<RestaurantResponse> =>
  apiService.post<RestaurantResponse, RestaurantResponse>(
    "/api/restaurant",
    data,
  );

/**
 * PATCH /api/restaurant/{restaurantId}
 * Cập nhật thông tin nhà hàng — cần đăng nhập (OWNER)
 * Tất cả fields đều optional, chỉ gửi field cần thay đổi
 */
export const updateRestaurant = async (
  restaurantId: number,
  data: UpdateRestaurantRequest,
): Promise<RestaurantResponse> =>
  apiService.patch<RestaurantResponse, RestaurantResponse>(
    `/api/restaurant/${restaurantId}`,
    data,
  );

/**
 * DELETE /api/restaurant/{restaurantId}
 * Xóa mềm (soft delete) nhà hàng — cần đăng nhập (OWNER / ADMIN)
 */
export const deleteRestaurant = async (
  restaurantId: number,
): Promise<ApiResponse<void>> =>
  apiService.delete<ApiResponse<void>, ApiResponse<void>>(
    `/api/restaurant/${restaurantId}`,
  );

/**
 * GET /api/restaurant/mine
 * Lấy danh sách nhà hàng của user đang đăng nhập — cần JWT token
 */
export const getMyRestaurants = async (): Promise<RestaurantResponse[]> =>
  apiService.get<RestaurantResponse[], RestaurantResponse[]>(
    "/api/restaurant/mine",
  );

// ─────────────────────────────────────────────────────────────
// RESTAURANT — ADMIN ONLY
// ─────────────────────────────────────────────────────────────

/**
 * GET /api/restaurant/by-user/{userId}
 * Admin lấy danh sách nhà hàng theo userId
 */
export const getRestaurantsByUserId = async (
  userId: number,
): Promise<RestaurantResponse[]> =>
  apiService.get<RestaurantResponse[], RestaurantResponse[]>(
    `/api/restaurant/by-user/${userId}`,
  );

// ─────────────────────────────────────────────────────────────
// REVIEW
// ─────────────────────────────────────────────────────────────

/** GET /api/restaurants/{restaurantId}/reviews */
export const getRestaurantReviews = async (
  restaurantId: number,
): Promise<ReviewResponse[]> =>
  apiService.get<ReviewResponse[], ReviewResponse[]>(
    `/api/restaurants/${restaurantId}/reviews`,
  );

/** POST /api/restaurants/{restaurantId}/reviews */
export const createRestaurantReview = async (
  restaurantId: number,
  data: CreateReviewRequest,
): Promise<ReviewResponse> =>
  apiService.post<ReviewResponse, ReviewResponse>(
    `/api/restaurants/${restaurantId}/reviews`,
    data,
  );

/** GET /api/reviews — Lấy tất cả review */
export const getReviews = async (): Promise<ReviewResponse[]> =>
  apiService.get<ReviewResponse[], ReviewResponse[]>("/api/reviews");

/** GET /api/reviews/{reviewId} — Lấy 1 review */
export const getReview = async (reviewId: number): Promise<ReviewResponse> =>
  apiService.get<ReviewResponse, ReviewResponse>(`/api/reviews/${reviewId}`);

/** PUT /api/reviews/{reviewId} — Cập nhật review */
export const updateReview = async (
  reviewId: number,
  data: CreateReviewRequest,
): Promise<ReviewResponse> =>
  apiService.put<ReviewResponse, ReviewResponse>(
    `/api/reviews/${reviewId}`,
    data,
  );

/** DELETE /api/reviews/{reviewId} — Xóa review */
export const deleteReview = async (
  reviewId: number,
): Promise<ApiResponse<void>> =>
  apiService.delete<ApiResponse<void>, ApiResponse<void>>(
    `/api/reviews/${reviewId}`,
  );

/** DELETE /api/admin/reviews/{reviewId} — Admin xóa review của bất kỳ user nào */
export const adminDeleteReview = async (
  reviewId: number,
): Promise<ApiResponse<void>> =>
  apiService.delete<ApiResponse<void>, ApiResponse<void>>(
    `/api/admin/reviews/${reviewId}`,
  );
