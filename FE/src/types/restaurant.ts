export interface MediaResponse {
  id: number;
  url: string;
  type: string;
}

export interface TypeRestaurantResponse {
  id: number;
  name: string;
  description: string | null;
}

export interface RestaurantResponse {
  id: number;
  name: string;
  description: string | null;
  phoneNumber: string | null;
  address: string | null;
  active: boolean;
  typeRestaurantId: number;
  typeRestaurantName: string;
  placeId: number | null;
  placeName: string | null;
  mediaList: MediaResponse[];
}

export interface CreateRestaurantRequest {
  name: string;
  address?: string;
  phoneNumber?: string;
  description?: string;
  placeId: number;
  typeRestaurantId: number;
  mediaUrls?: string[];
}

export interface UpdateRestaurantRequest {
  name?: string;
  address?: string;
  phoneNumber?: string;
  description?: string;
  placeId?: number;
  typeRestaurantId?: number;
  mediaUrls?: string[];
}

export interface PlaceResponse {
  id: number;
  name: string;
  district: string;
  city: string;
  address: string;
  mapUrl: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlaceRequest {
  name: string;
  district: string;
  city: string;
  address: string;
  mapUrl?: string;
}

export type UpdatePlaceRequest = Partial<PlaceRequest>;

export interface ReviewResponse {
  id: number;
  userId: number;
  restaurantId: number;
  restaurantName: string;
  typeRestaurantId: number;
  typeRestaurantName: string;
  restaurantMedia: MediaResponse[];
  rating: number;
  context: string;
}

export interface CreateReviewRequest {
  rating: number;
  context: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  code: string | null;
  data: T;
  timestamp: string | number[];
}
