package com.teamg5.be.dto;

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
public class AdminRestaurantResponseDTO {
    private Long id;

    private String name;
    private String address;
    private String thumbnailUrl;

    private Double rating;
    private Integer reviewCount;

    private String status; // PENDING, APPROVED, REJECTED

    private Long placeId;
    private String placeName;

    private Long ownerId;
    private String ownerName;

    private LocalDateTime createdAt;
}
