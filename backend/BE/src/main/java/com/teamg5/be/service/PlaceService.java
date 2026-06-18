package com.teamg5.be.service;

import com.teamg5.be.dto.CreatePlaceRequest;
import com.teamg5.be.dto.PageResponseDTO;
import com.teamg5.be.dto.PlaceResponse;
import com.teamg5.be.dto.PlaceRequest;
import com.teamg5.be.dto.UpdatePlaceRequest;

import java.util.List;

public interface PlaceService {
    List<PlaceResponse> getActivePlaces();
    PageResponseDTO<PlaceResponse> getAllPlacesForAdmin(String keyword, Boolean active, int page, int size);
    PlaceResponse createPlace(CreatePlaceRequest request);
    PlaceResponse updatePlace(Long id, CreatePlaceRequest request);
    PlaceResponse togglePlaceActive(Long id);
    void deletePlace(Long id);

    // Dev branch methods
    PlaceResponse createPlace(PlaceRequest request);
    PlaceResponse getPlaceById(Long placeId);
    List<PlaceResponse> getAllPlaces();
    PlaceResponse updatePlace(Long placeId, UpdatePlaceRequest request);
    void softDeletePlace(Long placeId);
}
