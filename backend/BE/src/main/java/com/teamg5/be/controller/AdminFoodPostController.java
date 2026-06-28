package com.teamg5.be.controller;

import com.teamg5.be.dto.*;
import com.teamg5.be.service.AdminFoodPostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin - Food Posts", description = "APIs dành cho Admin để kiểm duyệt bài đăng món ăn")
public class AdminFoodPostController {

    private final AdminFoodPostService adminFoodPostService;

    @GetMapping("/food-posts")
    @Operation(
        summary = "Lấy danh sách tất cả bài đăng món ăn (Phân trang, Tìm kiếm, Lọc)",
        description = "API dành cho Admin để quản lý danh sách bài đăng món ăn. Hỗ trợ tìm kiếm theo tiêu đề/nội dung/tên nhà hàng, lọc theo categoryId, status, minLikes, và sắp xếp linh hoạt."
    )
    public ResponseEntity<ApiResponse<AdminFoodPostListResponse>> getFoodPosts(
            @Parameter(description = "Từ khóa tìm kiếm (tiêu đề, nội dung, hoặc tên nhà hàng)", example = "phở")
            @RequestParam(required = false) String keyword,

            @Parameter(description = "Lọc theo tên/loại món ăn", example = "Cơm")
            @RequestParam(required = false) String categoryId,

            @Parameter(description = "Lọc theo trạng thái duyệt (PENDING, APPROVED, REJECTED)", example = "PENDING")
            @RequestParam(required = false) String status,

            @Parameter(description = "Lọc theo số lượt thích tối thiểu", example = "0")
            @RequestParam(required = false) Integer minLikes,

            @Parameter(description = "Trường cần sắp xếp (createdAt, likesCount, title)", example = "createdAt")
            @RequestParam(defaultValue = "createdAt") String sortBy,

            @Parameter(description = "Hướng sắp xếp (asc, desc)", example = "desc")
            @RequestParam(defaultValue = "desc") String sortDir,

            @Parameter(description = "Số trang cần lấy (bắt đầu từ 0)", example = "0")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Số lượng phần tử trên mỗi trang (tối đa 50)", example = "10")
            @RequestParam(defaultValue = "10") int size
    ) {
        AdminFoodPostListRequest request = new AdminFoodPostListRequest();
        request.setKeyword(keyword);
        request.setCategoryId(categoryId);
        request.setStatus(status);
        request.setMinLikes(minLikes);
        request.setSortBy(sortBy);
        request.setSortDir(sortDir);
        request.setPage(page);
        request.setSize(size);

        AdminFoodPostListResponse response = adminFoodPostService.getFoodPosts(request);
        return ResponseEntity.ok(ApiResponse.<AdminFoodPostListResponse>builder()
                .success(true)
                .message("Get food posts successfully")
                .data(response)
                .build());
    }

    @GetMapping("/food-posts/statistics")
    @Operation(
        summary = "Thống kê bài đăng món ăn",
        description = "API trả về các số liệu thống kê như tổng số bài đăng, bài đăng nổi bật (likes >= 150), số loại món, và đếm theo trạng thái."
    )
    public ResponseEntity<ApiResponse<FoodPostStatisticsResponse>> getStatistics() {
        FoodPostStatisticsResponse response = adminFoodPostService.getStatistics();
        return ResponseEntity.ok(ApiResponse.<FoodPostStatisticsResponse>builder()
                .success(true)
                .message("Get food post statistics successfully")
                .data(response)
                .build());
    }

    @GetMapping("/food-posts/{postId}")
    @Operation(
        summary = "Lấy chi tiết bài đăng món ăn",
        description = "Xem thông tin chi tiết một bài đăng món ăn để phục vụ kiểm duyệt."
    )
    public ResponseEntity<ApiResponse<AdminFoodPostDetailResponse>> getFoodPostDetail(
            @Parameter(description = "ID bài đăng món ăn", example = "1")
            @PathVariable Long postId
    ) {
        AdminFoodPostDetailResponse response = adminFoodPostService.getFoodPostDetail(postId);
        return ResponseEntity.ok(ApiResponse.<AdminFoodPostDetailResponse>builder()
                .success(true)
                .message("Get food post detail successfully")
                .data(response)
                .build());
    }

    @PatchMapping("/food-posts/{postId}/approve")
    @Operation(
        summary = "Duyệt bài đăng món ăn",
        description = "Chuyển trạng thái bài đăng sang APPROVED. Chỉ áp dụng cho bài đăng có trạng thái PENDING hoặc REJECTED."
    )
    public ResponseEntity<ApiResponse<FoodPostActionResponse>> approveFoodPost(
            @Parameter(description = "ID bài đăng món ăn", example = "1")
            @PathVariable Long postId,
            
            @RequestBody(required = false) ApproveFoodPostRequest request
    ) {
        ApproveFoodPostRequest body = request != null ? request : new ApproveFoodPostRequest();
        FoodPostActionResponse response = adminFoodPostService.approveFoodPost(postId, body);
        return ResponseEntity.ok(ApiResponse.<FoodPostActionResponse>builder()
                .success(true)
                .message(response.getMessage())
                .data(response)
                .build());
    }

    @PatchMapping("/food-posts/{postId}/reject")
    @Operation(
        summary = "Từ chối bài đăng món ăn",
        description = "Chuyển trạng thái bài đăng sang REJECTED kèm lý do. Chỉ áp dụng cho bài đăng có trạng thái PENDING hoặc APPROVED."
    )
    public ResponseEntity<ApiResponse<FoodPostActionResponse>> rejectFoodPost(
            @Parameter(description = "ID bài đăng món ăn", example = "1")
            @PathVariable Long postId,
            
            @Valid @RequestBody RejectFoodPostRequest request
    ) {
        FoodPostActionResponse response = adminFoodPostService.rejectFoodPost(postId, request);
        return ResponseEntity.ok(ApiResponse.<FoodPostActionResponse>builder()
                .success(true)
                .message(response.getMessage())
                .data(response)
                .build());
    }

    @GetMapping("/food-categories")
    @Operation(
        summary = "Lấy danh sách các loại món cho dropdown lọc",
        description = "Trả về danh sách tất cả các loại món đang tồn tại (tên loại món) cùng số lượng bài đăng thuộc loại đó."
    )
    public ResponseEntity<ApiResponse<List<FoodCategoryResponse>>> getFoodCategories() {
        List<FoodCategoryResponse> response = adminFoodPostService.getFoodCategories();
        return ResponseEntity.ok(ApiResponse.<List<FoodCategoryResponse>>builder()
                .success(true)
                .message("Get food categories dropdown successfully")
                .data(response)
                .build());
    }
}
