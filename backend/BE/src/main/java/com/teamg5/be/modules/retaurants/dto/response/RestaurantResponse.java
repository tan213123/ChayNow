package com.teamg5.be.modules.retaurants.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import com.teamg5.be.modules.retaurants.entity.Restaurant;


@Getter
@Setter
@Builder
public class RestaurantResponse {
    
    private Long id;
    private String name;
    private String description;
    private String phoneNumber;
    private String address;

    private Long typeRestaurantId;
    private String typeRestaurantName;

    private List<MediaResponse> mediaList;

    public static RestaurantResponse from(Restaurant restaurant) {
        return RestaurantResponse.builder()
                .id(restaurant.getId())
                .name(restaurant.getName())
                .description(restaurant.getDescription())
                .phoneNumber(restaurant.getPhoneNumber())
                .address(restaurant.getAddress())
                .typeRestaurantId(restaurant.getTypeRestaurant().getId())
                .typeRestaurantName(restaurant.getTypeRestaurant().getName())
                .mediaList(
                        restaurant.getMediaList().stream()
                        .map(MediaResponse::from)
                        .toList())
                .build();
    }
}
