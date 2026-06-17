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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/owner/postings")
@RequiredArgsConstructor
@Tag(name = "Owner - Postings", description = "API dành cho Owner để quản lý bài đăng của mình")
public class PostingController {

    private final PostingService postingService;

    @GetMapping
    @Operation(
        summary = "Lấy danh sách bài đăng của owner đang đăng nhập",
        description = """
            Trả về danh sách tất cả bài đăng thuộc về các nhà hàng do owner hiện tại quản lý.
            Mỗi bài đăng bao gồm: nội dung, hình ảnh, địa điểm quán, khu vực, menu đính kèm, ngày tạo và trạng thái duyệt.
            Hỗ trợ lọc theo trạng thái (PENDING/APPROVED/REJECTED), tìm kiếm từ khóa và lọc theo nhà hàng cụ thể.
            Yêu cầu xác thực bằng JWT token.
            """
    )
    public ResponseEntity<ApiResponse<PageResponseDTO<PostingResponse>>> getMyPostings(

            @Parameter(description = "Lọc theo trạng thái bài đăng (PENDING, APPROVED, REJECTED)", example = "APPROVED")
            @RequestParam(required = false) String status,

            @Parameter(description = "Tìm kiếm theo tiêu đề hoặc nội dung bài đăng", example = "phở chay")
            @RequestParam(required = false) String keyword,

            @Parameter(description = "Lọc bài đăng theo nhà hàng cụ thể (ID nhà hàng)", example = "1")
            @RequestParam(required = false) Long restaurantId,

            @Parameter(description = "Số trang (bắt đầu từ 0)", example = "0")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Số bài đăng trên mỗi trang (tối đa 50)", example = "10")
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponseDTO<PostingResponse> data = postingService.getMyPostings(
                status, keyword, restaurantId, page, size
        );
        return ResponseEntity.ok(ApiResponse.<PageResponseDTO<PostingResponse>>builder()
                .success(true)
                .message("Get postings successfully")
                .data(data)
                .build());
    }
}
