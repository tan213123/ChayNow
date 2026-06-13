package com.teamg5.be.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.teamg5.be.dto.PlaceResponse;
import com.teamg5.be.dto.UpdatePlaceRequest;
import com.teamg5.be.entity.Place;
import com.teamg5.be.exception.AppException;
import com.teamg5.be.exception.ErrorCode;
import com.teamg5.be.repository.PlaceRepository;
import com.teamg5.be.repository.RestaurantRepository;

import org.springframework.util.StringUtils;

import com.teamg5.be.dto.PlaceRequest;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
@Transactional
public class PlaceService {
    private final PlaceRepository placeRepository;
    private final RestaurantRepository restaurantRepository;

    //created
    public PlaceResponse createPlace(PlaceRequest request) {

        Place place = Place.builder()
                .name(request.getName().trim())
                .district(request.getDistrict())
                .city(request.getCity())
                .address(request.getAddress())
                .mapUrl(request.getMapUrl())
                .active(true)
                .build();

        Place savedPlace = placeRepository.save(place);

        return PlaceResponse.from(savedPlace);

        }

        // lay du lieu theo id
        @Transactional(readOnly = true)
    public PlaceResponse getPlaceById(Long placeId) {

        Place place = placeRepository.findByIdAndActiveTrue(placeId)
                .orElseThrow(() ->
                        new AppException(ErrorCode.PLACE_NOT_FOUND)
                );

        return PlaceResponse.from(place);
    }

    // lat toan bo

     @Transactional(readOnly = true)
    public List<PlaceResponse> getAllPlaces() {

        return placeRepository.findAllByActiveTrue()
                .stream()
                .map(PlaceResponse::from)
                .toList();
    }

    // update
     public PlaceResponse updatePlace(
            Long placeId,
            UpdatePlaceRequest request
    ) {
        Place place = placeRepository.findByIdAndActiveTrue(placeId)
                .orElseThrow(() ->
                        new AppException(ErrorCode.PLACE_NOT_FOUND)
                );

        if (StringUtils.hasText(request.getName())) {
            place.setName(request.getName().trim());
        }

        if (StringUtils.hasText(request.getDistrict())) {
            place.setDistrict(request.getDistrict().trim());
        }

        if (StringUtils.hasText(request.getCity())) {
            place.setCity(request.getCity().trim());
        }

        if (StringUtils.hasText(request.getAddress())) {
            place.setAddress(request.getAddress().trim());
        }

        
        

        if (StringUtils.hasText(request.getMapUrl())) {
            place.setMapUrl(request.getMapUrl().trim());
        }

        Place savedPlace = placeRepository.save(place);

        return PlaceResponse.from(savedPlace);
    }
// xoa

public void softDeletePlace(Long placeId) {

        Place place = placeRepository.findByIdAndActiveTrue(placeId)
                .orElseThrow(() ->
                        new AppException(ErrorCode.PLACE_NOT_FOUND)
                );

        boolean hasActiveRestaurant =
                restaurantRepository.existsByPlace_IdAndActiveTrue(placeId);

        if (hasActiveRestaurant) {
            throw new AppException(ErrorCode.PLACE_IN_USE);
        }

        place.setActive(false);

        placeRepository.save(place);
    }
}
