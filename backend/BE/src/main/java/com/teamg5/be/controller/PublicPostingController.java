package com.teamg5.be.controller;

import com.teamg5.be.dto.ApiResponse;
import com.teamg5.be.dto.PageResponseDTO;
import com.teamg5.be.dto.PostingResponse;
import com.teamg5.be.service.PostingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/postings")
@RequiredArgsConstructor
@Tag(name = "Public Postings", description = "APIs công khai để xem danh sách và chi tiết bài đăng đã được duyệt")
public class PublicPostingController {

    private final PostingService postingService;

    @GetMapping
    @Operation(
            summary = "Lấy danh sách bài đăng công khai",
            description = "Chỉ trả về các bài đăng đã được duyệt. Hỗ trợ tìm kiếm theo từ khóa, category, nhà hàng và khu vực."
    )
    public ResponseEntity<ApiResponse<PageResponseDTO<PostingResponse>>> getPublicPostings(
            @Parameter(description = "Từ khóa tìm kiếm", example = "phở")
            @RequestParam(required = false) String keyword,

            @Parameter(description = "Lọc theo category món ăn", example = "MAIN_DISH")
            @RequestParam(required = false) String categoryId,

            @Parameter(description = "Lọc theo nhà hàng", example = "1")
            @RequestParam(required = false) Long restaurantId,

            @Parameter(description = "Lọc theo khu vực", example = "1")
            @RequestParam(required = false) Long placeId,

            @Parameter(description = "Số trang (bắt đầu từ 0)", example = "0")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Số lượng phần tử trên mỗi trang (tối đa 50)", example = "10")
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponseDTO<PostingResponse> response = postingService.getPublicPostings(
                keyword, categoryId, restaurantId, placeId, page, size
        );
        return ResponseEntity.ok(ApiResponse.<PageResponseDTO<PostingResponse>>builder()
                .success(true)
                .message("Get public postings successfully")
                .data(response)
                .build());
    }

    @GetMapping("/{postingId}")
    @Operation(
            summary = "Lấy chi tiết bài đăng công khai",
            description = "Chỉ trả về bài đăng nếu trạng thái hiện tại là APPROVED."
    )
    public ResponseEntity<ApiResponse<PostingResponse>> getPublicPostingDetail(
            @Parameter(description = "ID bài đăng", example = "1")
            @PathVariable Long postingId
    ) {
        PostingResponse response = postingService.getPublicPostingDetail(postingId);
        return ResponseEntity.ok(ApiResponse.<PostingResponse>builder()
                .success(true)
                .message("Get public posting detail successfully")
                .data(response)
                .build());
    }
}
