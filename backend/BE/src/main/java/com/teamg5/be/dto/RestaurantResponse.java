package com.teamg5.be.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import com.teamg5.be.entity.Restaurant;

import jakarta.persistence.Column;


@Getter
@Setter
@Builder
public class RestaurantResponse {
    
    private Long id;
    private String name;
    private String description;
    private String phoneNumber;
    private String address;
    private Boolean active;
    private Long typeRestaurantId;
    private Long placeId;
    private String placeName;
    private String typeRestaurantName;
    
    private LocalTime openTime;
    
    private LocalTime closedTime;

    private List<MediaResponse> mediaList;

    public static RestaurantResponse from(Restaurant restaurant) {
         return RestaurantResponse.builder()
                .id(restaurant.getId())
                .name(restaurant.getName())
                .address(restaurant.getAddress())
                .description(restaurant.getDescription())
                .phoneNumber(restaurant.getPhoneNumber())

               // .operatingStatus(restaurant.getOperatingStatus())
                .active(restaurant.getActive())

                .placeId(
                        restaurant.getPlace() != null
                                ? restaurant.getPlace().getId()
                                : null
                )
                .placeName(
                        restaurant.getPlace() != null
                                ? restaurant.getPlace().getName()
                                : null
                )

                .typeRestaurantId(
                        restaurant.getTypeRestaurant().getId()
                )
                .typeRestaurantName(
                        restaurant.getTypeRestaurant().getName()
                )

                .mediaList(
                        restaurant.getMediaList()
                                .stream()
                                .map(MediaResponse::from)
                                .toList()
                )
                .openTime(restaurant.getOpenTime())
                .closedTime(restaurant.getClosedTime())
                .build();
    }
}
