package com.teamg5.be.dto;

import java.time.LocalDateTime;

import com.teamg5.be.entity.Place;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

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
                .mapUrl(place.getMapUrl())
                .active(place.getActive())
                .createdAt(place.getCreatedAt())
                .updatedAt(place.getUpdatedAt())
                .build();
    }
}
