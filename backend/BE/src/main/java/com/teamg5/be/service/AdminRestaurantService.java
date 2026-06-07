package com.teamg5.be.service;

import com.teamg5.be.dto.AdminRestaurantResponseDTO;
import com.teamg5.be.dto.PageResponseDTO;
import com.teamg5.be.dto.RejectRestaurantRequestDTO;

public interface AdminRestaurantService {
    PageResponseDTO<AdminRestaurantResponseDTO> getAllRestaurants(
            String keyword,
            String status,
            Long placeId,
            int page,
            int size
    );

    AdminRestaurantResponseDTO approveRestaurant(Long restaurantId);

    AdminRestaurantResponseDTO rejectRestaurant(Long restaurantId, RejectRestaurantRequestDTO request);
}
