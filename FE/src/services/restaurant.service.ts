import apiService from "@/services/api.service";
import type {
  CreateRestaurantRequest,
  CreateReviewRequest,
  RestaurantResponse,
  ReviewResponse,
  TypeRestaurantResponse,
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

export const createRestaurant = async (
  data: CreateRestaurantRequest,
): Promise<RestaurantResponse> =>
  apiService.post<RestaurantResponse, RestaurantResponse>(
    "/api/restaurant",
    data,
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
