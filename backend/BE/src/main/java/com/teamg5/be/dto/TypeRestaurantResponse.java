package com.teamg5.be.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import com.teamg5.be.entity.TypeRestaurant;

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
