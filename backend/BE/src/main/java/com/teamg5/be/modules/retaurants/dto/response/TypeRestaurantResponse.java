package com.teamg5.be.modules.retaurants.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import com.teamg5.be.modules.retaurants.entity.TypeRestaurant;

@Getter
@Setter
@Builder
public class TypeRestaurantResponse {
    
    private Long id;
    private String name;
    private String description;

    public static TypeRestaurantResponse from(TypeRestaurant typeRestaurant) {
        return TypeRestaurantResponse.builder()
                .id(typeRestaurant.getId())
                .name(typeRestaurant.getName())
                .description(typeRestaurant.getDescription())
                .build();
    }
   
}
