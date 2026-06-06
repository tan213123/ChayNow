package com.teamg5.be.modules.retaurants.controller;

import org.springframework.http.ResponseEntity;

import com.teamg5.be.modules.retaurants.dto.request.CreateReviewRequest;
import com.teamg5.be.modules.retaurants.dto.response.ReviewResponse;
import com.teamg5.be.modules.retaurants.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/restaurants/{restaurantId}/reviews")
@RequiredArgsConstructor

public class ReviewController {
    
    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(@PathVariable Long restaurantId, @Valid @RequestBody CreateReviewRequest request) {
        ReviewResponse response = reviewService.createReview(restaurantId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<?> getReviewsByRestaurant(
            @PathVariable Long restaurantId
    ) {
        return ResponseEntity.ok(reviewService.getReviewsByRestaurant(restaurantId));
    }
}
