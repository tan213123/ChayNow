package com.teamg5.be.controller;

import com.teamg5.be.dto.ApiResponse;
import com.teamg5.be.dto.CommentResponse;
import com.teamg5.be.dto.CreateCommentRequest;
import com.teamg5.be.dto.PageResponseDTO;
import com.teamg5.be.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Comments", description = "APIs để người dùng bình luận trên bài đăng")
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/postings/{postingId}/comments")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Tạo bình luận cho bài đăng")
    public ResponseEntity<ApiResponse<CommentResponse>> createComment(
            @Parameter(description = "ID bài đăng", example = "1")
            @PathVariable Long postingId,
            @Valid @RequestBody CreateCommentRequest request
    ) {
        CommentResponse response = commentService.createComment(postingId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<CommentResponse>builder()
                .success(true)
                .message("Comment created successfully")
                .data(response)
                .build());
    }

    @GetMapping("/postings/{postingId}/comments")
    @Operation(summary = "Lấy danh sách bình luận của bài đăng")
    public ResponseEntity<ApiResponse<PageResponseDTO<CommentResponse>>> getComments(
            @Parameter(description = "ID bài đăng", example = "1")
            @PathVariable Long postingId,
            @Parameter(description = "Số trang (bắt đầu từ 0)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Số lượng phần tử trên mỗi trang (tối đa 50)", example = "10")
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponseDTO<CommentResponse> response = commentService.getCommentsByPosting(postingId, page, size);
        return ResponseEntity.ok(ApiResponse.<PageResponseDTO<CommentResponse>>builder()
                .success(true)
                .message("Get comments successfully")
                .data(response)
                .build());
    }

    @DeleteMapping("/comments/{commentId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Xóa bình luận của chính mình")
    public ResponseEntity<ApiResponse<Void>> deleteMyComment(
            @Parameter(description = "ID bình luận", example = "1")
            @PathVariable Long commentId
    ) {
        commentService.deleteMyComment(commentId);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Comment deleted successfully")
                .data(null)
                .build());
    }
}
