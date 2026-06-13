package com.teamg5.be.dto;

import java.time.LocalDateTime;

import com.teamg5.be.entity.Place;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Builder()
public class PlaceResponse {
     private Long id;

    private String name;

    private String district;

    private String city;

    private String address;

    

    private String mapUrl;

    private Boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public static PlaceResponse from(Place place) {
        return PlaceResponse.builder()
                .id(place.getId())
                .name(place.getName())
                .district(place.getDistrict())
                .city(place.getCity())
                .address(place.getAddress())
                
                .mapUrl(place.getMapUrl())
                .active(place.getActive())
                .createdAt(place.getCreatedAt())
                .updatedAt(place.getUpdatedAt())
                .build();
    }
}
