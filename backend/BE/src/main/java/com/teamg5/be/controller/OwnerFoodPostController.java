package com.teamg5.be.controller;

import com.teamg5.be.dto.ApiResponse;
import com.teamg5.be.dto.CreateFoodPostRequest;
import com.teamg5.be.dto.FoodPostResponse;
import com.teamg5.be.service.OwnerFoodPostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/owner")
@RequiredArgsConstructor
@Tag(name = "Owner Food Posts", description = "APIs dành cho Owner để đăng bài giới thiệu món ăn mới")
public class OwnerFoodPostController {

    private final OwnerFoodPostService ownerFoodPostService;

    @PostMapping("/food-posts")
    @PreAuthorize("hasRole('OWNER')")
    @Operation(summary = "Đăng món ăn mới cho nhà hàng (Owner)")
    public ResponseEntity<ApiResponse<FoodPostResponse>> createFoodPost(
            @Valid @RequestBody CreateFoodPostRequest request
    ) {
        FoodPostResponse response = ownerFoodPostService.createFoodPost(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<FoodPostResponse>builder()
                .success(true)
                .message("Food post created successfully and is pending approval")
                .data(response)
                .build());
    }

    @GetMapping("/food-categories")
    @PreAuthorize("hasRole('OWNER')")
    @Operation(summary = "Lấy danh sách dropdown loại món ăn")
    public ResponseEntity<ApiResponse<List<Map<String, String>>>> getFoodCategories() {
        List<Map<String, String>> categories = ownerFoodPostService.getFoodCategories();
        return ResponseEntity.ok(ApiResponse.<List<Map<String, String>>>builder()
                .success(true)
                .message("Get food categories successfully")
                .data(categories)
                .build());
    }
}
