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
  ownerId: number | null;
  ownerName: string | null;
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
  mediaUrls?: string[];
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
  /** Định dạng "YYYY-MM-DD" (LocalDate từ backend) */
  startDate: string | null;
  /** Định dạng "YYYY-MM-DD" (LocalDate từ backend) */
  endDate: string | null;
  /** "UPCOMING" | "ACTIVE" | "EXPIRED" | "HIDDEN" */
  status: string | null;
  /** Định dạng ISO datetime từ backend */
  createdAt: string | null;
  /** Định dạng ISO datetime từ backend */
  updatedAt: string | null;
}

export interface CreateEventRequest {
  /** Required. Tối đa 255 ký tự */
  title: string;
  description?: string;
  /** URL ảnh, tối đa 500 ký tự */
  imageUrl?: string;
  /** Required. "CHARITY" hoặc "DISCOUNT" */
  eventType: EventType;
  /** Required. Định dạng "YYYY-MM-DD" */
  startDate: string;
  /** Required. Định dạng "YYYY-MM-DD" */
  endDate: string;
  /** "UPCOMING" | "ACTIVE" | "EXPIRED" | "HIDDEN" */
  status?: EventStatus;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  imageUrl?: string;
  eventType?: EventType;
  /** Định dạng "YYYY-MM-DD" */
  startDate?: string;
  /** Định dạng "YYYY-MM-DD" */
  endDate?: string;
  status?: EventStatus;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  code: string | null;
  data: T;
  timestamp: string | number[];
}
