package com.teamg5.be.dto;

import com.teamg5.be.entity.Posting;
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
public class FoodPostResponse {
    private Long id;
    private Long restaurantId;
    private String name;
    private String category;
    private String description;
    private String imageUrl;
    private String status;
    private LocalDateTime createdAt;

    public static FoodPostResponse from(Posting posting) {
        if (posting == null) return null;
        return FoodPostResponse.builder()
                .id(posting.getId())
                .restaurantId(posting.getRestaurant() != null ? posting.getRestaurant().getId() : null)
                .name(posting.getTitle())
                .category(posting.getCategory())
                .description(posting.getContent())
                .imageUrl(posting.getThumbnailUrl())
                .status(posting.getStatus())
                .createdAt(posting.getCreatedAt())
                .build();
    }
}
