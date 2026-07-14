package com.teamg5.be.service;

import com.teamg5.be.dto.*;
import java.util.List;

public interface AdminFoodPostService {
    AdminFoodPostListResponse getFoodPosts(AdminFoodPostListRequest request);
    AdminFoodPostDetailResponse getFoodPostDetail(Long postId);
    FoodPostActionResponse approveFoodPost(Long postId, ApproveFoodPostRequest request);
    FoodPostActionResponse rejectFoodPost(Long postId, RejectFoodPostRequest request);
    FoodPostStatisticsResponse getStatistics();
    List<FoodCategoryResponse> getFoodCategories();
}
