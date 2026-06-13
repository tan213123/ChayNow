import apiService from "@/services/api.service";
import type {
  ApiResponse,
  CreateRestaurantRequest,
  CreateReviewRequest,
  RestaurantResponse,
  ReviewResponse,
  TypeRestaurantResponse,
  UpdateRestaurantRequest,
} from "@/types/restaurant";

export const getTypeRestaurants = async (): Promise<
  TypeRestaurantResponse[]
> =>
  apiService.get<
    TypeRestaurantResponse[],
    TypeRestaurantResponse[]
  >("/api/type-restaurant");

export const getTypeRestaurant = async (
  typeRestaurantId: number,
): Promise<TypeRestaurantResponse> =>
  apiService.get<TypeRestaurantResponse, TypeRestaurantResponse>(
    `/api/type-restaurant/${typeRestaurantId}`,
  );

export const getRestaurant = async (
  restaurantId: number,
): Promise<RestaurantResponse> =>
  apiService.get<RestaurantResponse, RestaurantResponse>(
    `/api/restaurant/${restaurantId}`,
  );

export const getRestaurants = async (): Promise<RestaurantResponse[]> =>
  apiService.get<RestaurantResponse[], RestaurantResponse[]>(
    "/api/restaurant",
  );

export const createRestaurant = async (
  data: CreateRestaurantRequest,
): Promise<RestaurantResponse> =>
  apiService.post<RestaurantResponse, RestaurantResponse>(
    "/api/restaurant",
    data,
  );

export const updateRestaurant = async (
  restaurantId: number,
  data: UpdateRestaurantRequest,
): Promise<RestaurantResponse> =>
  apiService.patch<RestaurantResponse, RestaurantResponse>(
    `/api/restaurant/${restaurantId}`,
    data,
  );

export const deleteRestaurant = async (
  restaurantId: number,
): Promise<ApiResponse<void>> =>
  apiService.delete<ApiResponse<void>, ApiResponse<void>>(
    `/api/restaurant/${restaurantId}`,
  );

export const getRestaurantReviews = async (
  restaurantId: number,
): Promise<ReviewResponse[]> =>
  apiService.get<ReviewResponse[], ReviewResponse[]>(
    `/api/restaurants/${restaurantId}/reviews`,
  );

export const createRestaurantReview = async (
  restaurantId: number,
  data: CreateReviewRequest,
): Promise<ReviewResponse> =>
  apiService.post<ReviewResponse, ReviewResponse>(
    `/api/restaurants/${restaurantId}/reviews`,
    data,
  );

export const getReviews = async (): Promise<ReviewResponse[]> =>
  apiService.get<ReviewResponse[], ReviewResponse[]>("/api/reviews");

export const getReview = async (reviewId: number): Promise<ReviewResponse> =>
  apiService.get<ReviewResponse, ReviewResponse>(`/api/reviews/${reviewId}`);

export const updateReview = async (
  reviewId: number,
  data: CreateReviewRequest,
): Promise<ReviewResponse> =>
  apiService.put<ReviewResponse, ReviewResponse>(
    `/api/reviews/${reviewId}`,
    data,
  );

export const deleteReview = async (
  reviewId: number,
): Promise<ApiResponse<void>> =>
  apiService.delete<ApiResponse<void>, ApiResponse<void>>(
    `/api/reviews/${reviewId}`,
  );
