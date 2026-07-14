package com.teamg5.be.controller;

import com.teamg5.be.dto.ApiResponse;
import com.teamg5.be.dto.CreateReviewTestOptionRequest;
import com.teamg5.be.dto.ReviewTestOptionClickUserResponse;
import com.teamg5.be.dto.ReviewTestOptionResponse;
import com.teamg5.be.service.ReviewTestOptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Review Test Options", description = "APIs lưu click các lựa chọn đánh giá nhanh để thống kê")
public class ReviewTestOptionController {

    private final ReviewTestOptionService reviewTestOptionService;

    @GetMapping("/restaurants/{restaurantId}/review-test-options")
    @Operation(summary = "Lấy danh sách lựa chọn đánh giá nhanh kèm số click của nhà hàng")
    public ResponseEntity<ApiResponse<List<ReviewTestOptionResponse>>> getOptions(
            @PathVariable Long restaurantId
    ) {
        List<ReviewTestOptionResponse> response = reviewTestOptionService.getOptionsForRestaurant(restaurantId);
        return ResponseEntity.ok(ApiResponse.<List<ReviewTestOptionResponse>>builder()
                .success(true)
                .message("Get review test options successfully")
                .data(response)
                .build());
    }

    @PostMapping("/restaurants/{restaurantId}/review-test-options/{optionId}/click")
    @Operation(summary = "User click một lựa chọn đánh giá nhanh")
    public ResponseEntity<ApiResponse<ReviewTestOptionResponse>> clickOption(
            @PathVariable Long restaurantId,
            @PathVariable Long optionId
    ) {
        ReviewTestOptionResponse response = reviewTestOptionService.clickOption(restaurantId, optionId);
        return ResponseEntity.ok(ApiResponse.<ReviewTestOptionResponse>builder()
                .success(true)
                .message("Clicked review test option successfully")
                .data(response)
                .build());
    }

    @DeleteMapping("/restaurants/{restaurantId}/review-test-options/{optionId}/click")
    @Operation(summary = "User bỏ click một lựa chọn đánh giá nhanh")
    public ResponseEntity<ApiResponse<Void>> unclickOption(
            @PathVariable Long restaurantId,
            @PathVariable Long optionId
    ) {
        reviewTestOptionService.unclickOption(restaurantId, optionId);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Unclicked review test option successfully")
                .build());
    }

    @GetMapping("/restaurants/{restaurantId}/review-test-options/{optionId}/users")
    @Operation(summary = "Xem danh sách user đã click một lựa chọn của nhà hàng")
    public ResponseEntity<ApiResponse<List<ReviewTestOptionClickUserResponse>>> getClickedUsers(
            @PathVariable Long restaurantId,
            @PathVariable Long optionId
    ) {
        List<ReviewTestOptionClickUserResponse> response = reviewTestOptionService.getClickedUsers(restaurantId, optionId);
        return ResponseEntity.ok(ApiResponse.<List<ReviewTestOptionClickUserResponse>>builder()
                .success(true)
                .message("Get clicked users successfully")
                .data(response)
                .build());
    }

    @PostMapping("/review-test-options")
    @Operation(summary = "Tạo lựa chọn đánh giá nhanh mới")
    public ResponseEntity<ApiResponse<ReviewTestOptionResponse>> createOption(
            @Valid @RequestBody CreateReviewTestOptionRequest request
    ) {
        ReviewTestOptionResponse response = reviewTestOptionService.createOption(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<ReviewTestOptionResponse>builder()
                .success(true)
                .message("Review test option created successfully")
                .data(response)
                .build());
    }
}
