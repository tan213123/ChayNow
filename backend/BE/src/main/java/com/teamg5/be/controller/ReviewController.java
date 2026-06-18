package com.teamg5.be.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import com.teamg5.be.dto.ApiResponse;
import com.teamg5.be.dto.CreateReviewRequest;
import com.teamg5.be.dto.ReviewResponse;
import com.teamg5.be.service.ReviewService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor

public class ReviewController {
    
    private final ReviewService reviewService;

    @PostMapping("/restaurants/{restaurantId}/reviews")
    public ResponseEntity<ReviewResponse> createReview(@PathVariable Long restaurantId, @Valid @RequestBody CreateReviewRequest request) {
        ReviewResponse response = reviewService.createReview(restaurantId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/restaurants/{restaurantId}/reviews")
    @Operation(summary = "Lấy đánh giá theo nhà hàng")
    public ResponseEntity<List<ReviewResponse>>
    getReviewsByRestaurant(
            @PathVariable Long restaurantId
    ) {
        List<ReviewResponse> response =
                reviewService.getReviewsByRestaurant(
                        restaurantId
                );

        return ResponseEntity.ok(response);
    }
    @GetMapping("/reviews")
    // @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Lấy tất cả đánh giá")
    public ResponseEntity<List<ReviewResponse>> getAllReviews() {

        return ResponseEntity.ok(
                reviewService.getAllReviews()
        );
    }

    @GetMapping("/reviews/{reviewId}")
    @Operation(summary = "Lấy đánh giá theo ID")
    public ResponseEntity<ReviewResponse> getReviewById(
            @PathVariable Long reviewId
    ) {
        return ResponseEntity.ok(
                reviewService.getReviewById(reviewId)
        );
    }

    @PutMapping("/reviews/{reviewId}")
    @Operation(summary = "Cập nhật đánh giá")
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable Long reviewId,
            @Valid @RequestBody CreateReviewRequest request
    ) {
        ReviewResponse response =
                reviewService.updateReview(
                        reviewId,
                        request
                );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/reviews/{reviewId}")
    @Operation(summary = "Người dùng xóa đánh giá của mình")
    public ResponseEntity<ApiResponse<Void>> deleteReview(
            @PathVariable Long reviewId
    ) {
        reviewService.deleteReview(reviewId);

        ApiResponse<Void>  response = ApiResponse.<Void>builder()
                     .success(true)
                    .message("delete successfull!")
                    .data(null)
                    .build();       
         return ResponseEntity.ok(response);
    }

    @DeleteMapping("/admin/reviews/{reviewId}")
    // @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Admin xóa đánh giá")
    public ResponseEntity<ApiResponse<Void>> adminDeleteReview(
            @PathVariable Long reviewId
    ) {
        reviewService.adminDeleteReview(reviewId);

        ApiResponse<Void>  response = ApiResponse.<Void>builder()
                     .success(true)
                    .message("delete successfull!")
                    .data(null)
                    .build();  
        return ResponseEntity.ok(response);
    }
}
