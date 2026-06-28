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
public class PostingResponse {

    private Long id;
    private String title;
    private String content;
    private String category;
    private String thumbnailUrl;
    private Integer likeCount;
    private Integer commentCount;
    private String status;          // PENDING, APPROVED, REJECTED
    private String rejectReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Thông tin tác giả (owner)
    private Long authorId;
    private String authorName;
    private String authorAvatarUrl;

    // Thông tin nhà hàng đính kèm
    private Long restaurantId;
    private String restaurantName;
    private String restaurantAddress;
    private String restaurantPhone;
    private String restaurantThumbnailUrl;  // ảnh đại diện nhà hàng

    // Thông tin khu vực
    private Long placeId;
    private String placeName;
    private String placeCity;

    // Menu đính kèm (nếu có)
    private Long menuId;
    private String menuName;
    private Integer menuPrice;
}
