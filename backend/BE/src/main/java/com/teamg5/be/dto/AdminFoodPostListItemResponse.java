package com.teamg5.be.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminFoodPostListItemResponse {
    private String id;
    private String title;
    private String description;
    private String imageUrl;

    private String restaurantId;
    private String restaurantName;

    private String categoryId;
    private String categoryName;

    private Integer likesCount;
    private String status;
    private String rejectedReason;

    private LocalDateTime createdAt;
}
