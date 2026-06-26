package com.teamg5.be.service;

import com.teamg5.be.dto.CreateFoodPostRequest;
import com.teamg5.be.dto.FoodPostResponse;

import java.util.List;
import java.util.Map;

public interface OwnerFoodPostService {
    FoodPostResponse createFoodPost(CreateFoodPostRequest request);
    List<Map<String, String>> getFoodCategories();
}
