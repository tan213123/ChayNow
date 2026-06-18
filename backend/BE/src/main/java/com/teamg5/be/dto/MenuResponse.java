package com.teamg5.be.dto;

import java.time.LocalDateTime;

import com.teamg5.be.entity.Menu;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class MenuResponse {
     private Long id;

    private Long restaurantId;

    private String restaurantName;

    private String name;

    private String description;

    private Integer price;

    private String category;

    private String imageUrl;

    private Boolean available;

    private Boolean featured;

    private Boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public static MenuResponse from(Menu menu) {
        return MenuResponse.builder()
                .id(menu.getId())
                .restaurantId(menu.getRestaurant().getId())
                .restaurantName(menu.getRestaurant().getName())
                .name(menu.getName())
                .description(menu.getDescription())
                .price(menu.getPrice())
                .category(menu.getCategory())
                .imageUrl(menu.getImageUrl())
                .available(menu.getAvailable())
                .featured(menu.getFeatured())
                .active(menu.getActive())
                .createdAt(menu.getCreatedAt())
                .updatedAt(menu.getUpdatedAt())
                .build();
    }
}
