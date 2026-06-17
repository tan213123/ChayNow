package com.teamg5.be.service;

import com.teamg5.be.dto.CreatePlaceRequest;
import com.teamg5.be.dto.PageResponseDTO;
import com.teamg5.be.dto.PlaceResponse;

import java.util.List;

public interface PlaceService {
    List<PlaceResponse> getActivePlaces();
    PageResponseDTO<PlaceResponse> getAllPlacesForAdmin(String keyword, Boolean active, int page, int size);
    PlaceResponse createPlace(CreatePlaceRequest request);
    PlaceResponse updatePlace(Long id, CreatePlaceRequest request);
    PlaceResponse togglePlaceActive(Long id);
    void deletePlace(Long id);
}
