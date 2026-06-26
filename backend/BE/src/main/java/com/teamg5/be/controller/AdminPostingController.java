package com.teamg5.be.controller;

import com.teamg5.be.dto.ApiResponse;
import com.teamg5.be.dto.PageResponseDTO;
import com.teamg5.be.dto.PostingResponse;
import com.teamg5.be.dto.RejectPostingRequestDTO;
import com.teamg5.be.service.AdminPostingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/postings")
@RequiredArgsConstructor
@Tag(name = "Admin Posting Management", description = "APIs dành cho Admin để kiểm duyệt bài đăng của các Owner")
public class AdminPostingController {

    private final AdminPostingService adminPostingService;

    @GetMapping
    @Operation(
        summary = "Lấy danh sách tất cả bài đăng (Phân trang, Tìm kiếm, Lọc trạng thái)",
        description = "API này dành cho Admin để kiểm duyệt danh sách các bài đăng. Hỗ trợ tìm kiếm theo tiêu đề hoặc nội dung hoặc tên nhà hàng, lọc theo trạng thái duyệt (PENDING, APPROVED, REJECTED)."
    )
    public ResponseEntity<ApiResponse<PageResponseDTO<PostingResponse>>> getAllPostings(
            @Parameter(description = "Từ khóa tìm kiếm (tiêu đề, nội dung, hoặc nhà hàng)", example = "phở")
            @RequestParam(required = false) String keyword,

            @Parameter(description = "Lọc theo trạng thái duyệt (PENDING, APPROVED, REJECTED)", example = "PENDING")
            @RequestParam(required = false) String status,

            @Parameter(description = "Số trang cần lấy (bắt đầu từ 0)", example = "0")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Số lượng phần tử trên mỗi trang (tối đa 50)", example = "10")
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponseDTO<PostingResponse> response = adminPostingService.getAllPostings(keyword, status, page, size);
        return ResponseEntity.ok(ApiResponse.<PageResponseDTO<PostingResponse>>builder()
                .success(true)
                .message("Get all postings successfully")
                .data(response)
                .build());
    }

    @PatchMapping("/{id}/approve")
    @Operation(summary = "Duyệt bài đăng", description = "Chuyển trạng thái bài đăng từ PENDING thành APPROVED.")
    public ResponseEntity<ApiResponse<PostingResponse>> approvePosting(
            @PathVariable Long id
    ) {
        PostingResponse response = adminPostingService.approvePosting(id);
        return ResponseEntity.ok(ApiResponse.<PostingResponse>builder()
                .success(true)
                .message("Posting approved successfully")
                .data(response)
                .build());
    }

    @PatchMapping("/{id}/reject")
    @Operation(summary = "Từ chối duyệt bài đăng", description = "Chuyển trạng thái bài đăng thành REJECTED và ghi rõ lý do.")
    public ResponseEntity<ApiResponse<PostingResponse>> rejectPosting(
            @PathVariable Long id,
            @RequestBody RejectPostingRequestDTO request
    ) {
        PostingResponse response = adminPostingService.rejectPosting(id, request);
        return ResponseEntity.ok(ApiResponse.<PostingResponse>builder()
                .success(true)
                .message("Posting rejected successfully")
                .data(response)
                .build());
    }
}
