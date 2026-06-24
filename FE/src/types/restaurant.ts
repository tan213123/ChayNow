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

export interface CreateTypeRestaurantRequest {
  name: string;
  description?: string;
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
  openTime: string | null;
  closedTime: string | null;
  mediaList: MediaResponse[];
}

export interface CreateRestaurantRequest {
  name: string;
  address?: string;
  phoneNumber?: string;
  description?: string;
  placeId: number;
  typeRestaurantId: number;
  openTime: string;
  closedTime: string;
}

export interface UpdateRestaurantRequest {
  name?: string;
  address?: string;
  phoneNumber?: string;
  description?: string;
  placeId?: number;
  typeRestaurantId?: number;
  openTime?: string;
  closedTime?: string;
  mediaIds?: number[];
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
  mediaList?: MediaResponse[];
  rating: number;
  context: string;
}

export interface CreateReviewRequest {
  rating: number;
  context: string;
}

export interface MenuResponse {
  id: number;
  restaurantId: number;
  restaurantName: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  imageUrl: string | null;
  available: boolean;
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMenuRequest {
  name: string;
  description?: string;
  price: number;
  category?: string;
  imageUrl?: string;
  available?: boolean;
  featured?: boolean;
}

export type UpdateMenuRequest = Partial<CreateMenuRequest>;

export type EventType = "CHARITY" | "DISCOUNT";

export type EventStatus = "UPCOMING" | "ACTIVE" | "EXPIRED" | "HIDDEN";

export interface EventResponse {
  id: number;
  restaurantId: number;
  restaurantName: string | null;
  creatorId: number | null;
  creatorName: string | null;
  title: string;
  description: string | null;
  imageUrl: string | null;
  eventType: EventType | null;
  startDate: string | null;
  endDate: string | null;
  status: EventStatus | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventRequest {
  title: string;
  description?: string;
  imageUrl?: string;
  eventType: EventType;
  startDate: string;
  endDate: string;
  status?: EventStatus;
}

export type UpdateEventRequest = Partial<CreateEventRequest>;

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  code: string | null;
  data: T;
  timestamp: string | number[];
}
