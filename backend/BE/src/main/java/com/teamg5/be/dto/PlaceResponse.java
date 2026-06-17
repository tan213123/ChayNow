package com.teamg5.be.dto;

import com.teamg5.be.entity.Place;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlaceResponse {
    private Long id;
    private String name;
    private String district;
    private String city;
    private String address;
    private Double latitude;
    private Double longitude;
    private String mapUrl;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PlaceResponse from(Place place) {
        if (place == null) return null;
        return PlaceResponse.builder()
                .id(place.getId())
                .name(place.getName())
                .district(place.getDistrict())
                .city(place.getCity())
                .address(place.getAddress())
                .latitude(place.getLatitude())
                .longitude(place.getLongitude())
                .mapUrl(place.getMapUrl())
                .active(place.getActive())
                .createdAt(place.getCreatedAt())
                .updatedAt(place.getUpdatedAt())
                .build();
    }
}
