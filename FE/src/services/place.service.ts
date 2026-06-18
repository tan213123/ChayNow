import apiService from "@/services/api.service";
import type {
  ApiResponse,
  PlaceRequest,
  PlaceResponse,
  UpdatePlaceRequest,
} from "@/types/restaurant";

export const getPlaces = async (): Promise<PlaceResponse[]> =>
  apiService.get<PlaceResponse[], PlaceResponse[]>("/api/places");

export const getPlace = async (placeId: number): Promise<PlaceResponse> =>
  apiService.get<PlaceResponse, PlaceResponse>(`/api/places/${placeId}`);

export const createPlace = async (
  data: PlaceRequest,
): Promise<PlaceResponse> =>
  apiService.post<PlaceResponse, PlaceResponse>("/api/places", data);

export const updatePlace = async (
  placeId: number,
  data: UpdatePlaceRequest,
): Promise<PlaceResponse> =>
  apiService.patch<PlaceResponse, PlaceResponse>(
    `/api/places/${placeId}`,
    data,
  );

export const deletePlace = async (
  placeId: number,
): Promise<ApiResponse<void>> =>
  apiService.delete<ApiResponse<void>, ApiResponse<void>>(
    `/api/places/${placeId}`,
  );
