package com.teamg5.be.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    // User stats
    private long totalUsers;
    private long totalOwners;
    private long totalAdmins;

    // Restaurant stats
    private long totalRestaurants;
    private long pendingRestaurants;
    private long approvedRestaurants;
    private long rejectedRestaurants;

    // Content stats
    private long totalReviews;
    private long totalPostings;

    // Report stats
    private long pendingReports;
    private long resolvedReports;
    private long rejectedReports;
}
