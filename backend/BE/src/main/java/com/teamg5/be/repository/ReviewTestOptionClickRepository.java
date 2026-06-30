package com.teamg5.be.repository;

import com.teamg5.be.entity.ReviewTestOptionClick;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewTestOptionClickRepository extends JpaRepository<ReviewTestOptionClick, Long> {
    boolean existsByUser_IdAndRestaurant_IdAndOption_Id(Long userId, Long restaurantId, Long optionId);
    Optional<ReviewTestOptionClick> findByUser_IdAndRestaurant_IdAndOption_Id(Long userId, Long restaurantId, Long optionId);
    long countByRestaurant_IdAndOption_Id(Long restaurantId, Long optionId);
    List<ReviewTestOptionClick> findByRestaurant_IdAndOption_IdOrderByCreatedAtDesc(Long restaurantId, Long optionId);
}
