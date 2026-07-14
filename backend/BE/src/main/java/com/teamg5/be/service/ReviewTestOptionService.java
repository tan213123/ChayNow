package com.teamg5.be.service;

import com.teamg5.be.dto.CreateReviewTestOptionRequest;
import com.teamg5.be.dto.ReviewTestOptionClickUserResponse;
import com.teamg5.be.dto.ReviewTestOptionResponse;

import java.util.List;

public interface ReviewTestOptionService {
    List<ReviewTestOptionResponse> getOptionsForRestaurant(Long restaurantId);
    ReviewTestOptionResponse clickOption(Long restaurantId, Long optionId);
    void unclickOption(Long restaurantId, Long optionId);
    List<ReviewTestOptionClickUserResponse> getClickedUsers(Long restaurantId, Long optionId);
    ReviewTestOptionResponse createOption(CreateReviewTestOptionRequest request);
}
