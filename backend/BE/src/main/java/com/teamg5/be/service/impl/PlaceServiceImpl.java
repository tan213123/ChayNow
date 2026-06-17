package com.teamg5.be.service.impl;

import com.teamg5.be.dto.CreatePlaceRequest;
import com.teamg5.be.dto.PageResponseDTO;
import com.teamg5.be.dto.PlaceResponse;
import com.teamg5.be.entity.Place;
import com.teamg5.be.exception.AppException;
import com.teamg5.be.exception.ErrorCode;
import com.teamg5.be.repository.PlaceRepository;
import com.teamg5.be.service.PlaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlaceServiceImpl implements PlaceService {

    private final PlaceRepository placeRepository;

    @Override
    @Transactional(readOnly = true)
    public List<PlaceResponse> getActivePlaces() {
        return placeRepository.findAll().stream()
                .filter(p -> p.getActive() != null && p.getActive())
                .map(PlaceResponse::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponseDTO<PlaceResponse> getAllPlacesForAdmin(String keyword, Boolean active, int page, int size) {
        if (size > 50) size = 50;
        PageRequest pageable = PageRequest.of(page, size);

        String searchKeyword = (keyword != null && !keyword.isBlank()) ? keyword.trim() : null;

        Page<Place> dbPage = placeRepository.findAllForAdmin(searchKeyword, active, pageable);

        List<PlaceResponse> content = dbPage.getContent().stream()
                .map(PlaceResponse::from)
                .toList();

        return PageResponseDTO.<PlaceResponse>builder()
                .content(content)
                .page(dbPage.getNumber())
                .size(dbPage.getSize())
                .totalElements(dbPage.getTotalElements())
                .totalPages(dbPage.getTotalPages())
                .last(dbPage.isLast())
                .build();
    }

    @Override
    @Transactional
    public PlaceResponse createPlace(CreatePlaceRequest request) {
        boolean existed = placeRepository.existsByName(request.getName());
        if (existed) {
            throw new AppException(ErrorCode.PLACE_ALREADY_EXISTS);
        }

        Place place = Place.builder()
                .name(request.getName())
                .district(request.getDistrict())
                .city(request.getCity())
                .address(request.getAddress())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .mapUrl(request.getMapUrl())
                .active(request.getActive() != null ? request.getActive() : true)
                .build();

        Place saved = placeRepository.save(place);
        return PlaceResponse.from(saved);
    }

    @Override
    @Transactional
    public PlaceResponse updatePlace(Long id, CreatePlaceRequest request) {
        Place place = placeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PLACE_NOT_FOUND));

        if (!place.getName().equalsIgnoreCase(request.getName())) {
            boolean existed = placeRepository.existsByName(request.getName());
            if (existed) {
                throw new AppException(ErrorCode.PLACE_ALREADY_EXISTS);
            }
        }

        place.setName(request.getName());
        place.setDistrict(request.getDistrict());
        place.setCity(request.getCity());
        place.setAddress(request.getAddress());
        place.setLatitude(request.getLatitude());
        place.setLongitude(request.getLongitude());
        place.setMapUrl(request.getMapUrl());
        if (request.getActive() != null) {
            place.setActive(request.getActive());
        }

        Place saved = placeRepository.save(place);
        return PlaceResponse.from(saved);
    }

    @Override
    @Transactional
    public PlaceResponse togglePlaceActive(Long id) {
        Place place = placeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PLACE_NOT_FOUND));

        place.setActive(place.getActive() == null || !place.getActive());

        Place saved = placeRepository.save(place);
        return PlaceResponse.from(saved);
    }

    @Override
    @Transactional
    public void deletePlace(Long id) {
        Place place = placeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PLACE_NOT_FOUND));

        if (place.getRestaurants() != null && !place.getRestaurants().isEmpty()) {
            throw new AppException(ErrorCode.INVALID_INPUT);
        }

        placeRepository.delete(place);
    }
}
