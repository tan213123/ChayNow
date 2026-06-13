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
  typeRestaurantId: number;
  typeRestaurantName: string;
  mediaList: MediaResponse[];
}

export interface CreateRestaurantRequest {
  name: string;
  address?: string;
  phoneNumber?: string;
  description?: string;
  typeRestaurantId: number;
  mediaUrls?: string[];
}

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
