import apiService from "@/services/api.service";
import type {
  ApiResponse,
  CreateEventRequest,
  EventResponse,
  MediaResponse,
  UpdateEventRequest,
} from "@/types/restaurant";

// ─────────────────────────────────────────────────────────────
// EVENT — PUBLIC
// ─────────────────────────────────────────────────────────────

/**
 * GET /api/events
 * Lấy tất cả sự kiện (không cần auth)
 */
export const getEvents = async (): Promise<EventResponse[]> =>
  apiService.get<EventResponse[], EventResponse[]>("/api/events");

/**
 * GET /api/restaurants/{restaurantId}/events
 * Lấy danh sách sự kiện của 1 nhà hàng (không cần auth)
 *
 * @param restaurantId - ID của nhà hàng
 */
export const getRestaurantEvents = async (
  restaurantId: number,
): Promise<EventResponse[]> =>
  apiService.get<EventResponse[], EventResponse[]>(
    `/api/restaurants/${restaurantId}/events`,
  );

/**
 * GET /api/events/{eventId}
 * Lấy thông tin chi tiết của 1 sự kiện (không cần auth)
 *
 * @param eventId - ID của sự kiện
 */
export const getEvent = async (eventId: number): Promise<EventResponse> =>
  apiService.get<EventResponse, EventResponse>(`/api/events/${eventId}`);

export const uploadEventImage = async (
  file: File,
): Promise<ApiResponse<MediaResponse>> => {
  const formData = new FormData();
  formData.append("file", file);

  return apiService.post<ApiResponse<MediaResponse>, ApiResponse<MediaResponse>>(
    "/api/events/upload-image",
    formData,
    { timeout: 60000 },
  );
};

// ─────────────────────────────────────────────────────────────
// EVENT — AUTH REQUIRED (OWNER)
// ─────────────────────────────────────────────────────────────

/**
 * POST /api/restaurants/{restaurantId}/events
 * Tạo sự kiện mới cho nhà hàng — cần đăng nhập (OWNER)
 *
 * @param restaurantId - ID của nhà hàng
 * @param data - Thông tin sự kiện cần tạo
 *
 * @example
 * createEvent(1, {
 *   title: "Khuyến mãi mùa hè",
 *   description: "Giảm 20% tất cả món",
 *   imageUrl: "http://img.jpg",
 *   eventType: "DISCOUNT",
 *   startDate: "2025-07-01",
 *   endDate: "2025-07-31",
 *   status: "UPCOMING",
 * });
 */
export const createEvent = async (
  restaurantId: number,
  data: CreateEventRequest,
): Promise<EventResponse> =>
  apiService.post<EventResponse, EventResponse>(
    `/api/restaurants/${restaurantId}/events`,
    data,
  );

/**
 * PATCH /api/events/{eventId}
 * Cập nhật thông tin sự kiện — cần đăng nhập (OWNER)
 * Tất cả fields đều optional, chỉ gửi field cần thay đổi
 *
 * @param eventId - ID của sự kiện
 * @param data - Các trường cần cập nhật
 *
 * @example
 * // Chỉ cập nhật status
 * updateEvent(5, { status: "ACTIVE" });
 *
 * // Cập nhật nhiều trường
 * updateEvent(5, {
 *   title: "Tên mới",
 *   endDate: "2025-08-31",
 *   status: "EXPIRED",
 * });
 */
export const updateEvent = async (
  eventId: number,
  data: UpdateEventRequest,
): Promise<EventResponse> =>
  apiService.patch<EventResponse, EventResponse>(
    `/api/events/${eventId}`,
    data,
  );

/**
 * DELETE /api/events/{eventId}
 * Xóa sự kiện — cần đăng nhập (OWNER / ADMIN)
 *
 * @param eventId - ID của sự kiện cần xóa
 */
export const deleteEvent = async (
  eventId: number,
): Promise<ApiResponse<void>> =>
  apiService.delete<ApiResponse<void>, ApiResponse<void>>(
    `/api/events/${eventId}`,
  );
