import apiService from "@/services/api.service";
import type {
  ApiResponse,
  CreateEventRequest,
  EventResponse,
  UpdateEventRequest,
} from "@/types/restaurant";

export const getEvents = async (): Promise<EventResponse[]> =>
  apiService.get<EventResponse[], EventResponse[]>("/api/events");

export const getRestaurantEvents = async (
  restaurantId: number,
): Promise<EventResponse[]> =>
  apiService.get<EventResponse[], EventResponse[]>(
    `/api/restaurants/${restaurantId}/events`,
  );

export const getEvent = async (eventId: number): Promise<EventResponse> =>
  apiService.get<EventResponse, EventResponse>(`/api/events/${eventId}`);

export const createEvent = async (
  restaurantId: number,
  data: CreateEventRequest,
): Promise<EventResponse> =>
  apiService.post<EventResponse, EventResponse>(
    `/api/restaurants/${restaurantId}/events`,
    data,
  );

export const updateEvent = async (
  eventId: number,
  data: UpdateEventRequest,
): Promise<EventResponse> =>
  apiService.patch<EventResponse, EventResponse>(`/api/events/${eventId}`, data);

export const deleteEvent = async (
  eventId: number,
): Promise<ApiResponse<void>> =>
  apiService.delete<ApiResponse<void>, ApiResponse<void>>(
    `/api/events/${eventId}`,
  );
