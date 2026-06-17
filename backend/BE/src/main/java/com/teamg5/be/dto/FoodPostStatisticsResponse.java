package com.teamg5.be.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FoodPostStatisticsResponse {
    private long totalPosts;
    private long featuredPosts;
    private long totalCategories;
    private long pendingPosts;
    private long approvedPosts;
    private long rejectedPosts;
}
