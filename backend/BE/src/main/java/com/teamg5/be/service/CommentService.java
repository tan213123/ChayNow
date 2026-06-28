package com.teamg5.be.service;

import com.teamg5.be.dto.CommentResponse;
import com.teamg5.be.dto.CreateCommentRequest;
import com.teamg5.be.dto.PageResponseDTO;
import com.teamg5.be.entity.Comment;

/**
 * Service interface quản lý các thao tác liên quan đến bình luận (Comment).
 */
public interface CommentService {

    /**
     * Tạo một bình luận mới cho bài đăng.
     *
     * @param postingId ID của bài đăng cần bình luận
     * @param request thông tin nội dung bình luận
     * @return CommentResponse phản hồi chứa thông tin bình luận vừa tạo
     */
    CommentResponse createComment(Long postingId, CreateCommentRequest request);

    /**
     * Lấy danh sách bình luận của một bài đăng với phân trang.
     *
     * @param postingId ID của bài đăng
     * @param page số trang hiện tại
     * @param size kích thước trang
     * @return PageResponseDTO chứa danh sách bình luận
     */
    PageResponseDTO<CommentResponse> getCommentsByPosting(Long postingId, int page, int size);

    /**
     * Xóa bình luận của bản thân người dùng hiện tại.
     *
     * @param commentId ID của bình luận cần xóa
     */
    void deleteMyComment(Long commentId);

    /**
     * Xóa bình luận theo ID (dành cho quản trị viên hoặc quyền hạn tương đương).
     *
     * @param commentId ID của bình luận cần xóa
     */
    void deleteCommentById(Long commentId);

    /**
     * Lấy thực thể bình luận theo ID.
     *
     * @param commentId ID của bình luận
     * @return Comment thực thể bình luận
     */
    Comment getCommentById(Long commentId);
}
