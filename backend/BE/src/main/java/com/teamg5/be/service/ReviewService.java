package com.teamg5.be.service;

import com.teamg5.be.dto.CreateReviewRequest;
import com.teamg5.be.dto.ReviewResponse;

import java.util.List;

/**
 * Service interface quản lý các đánh giá (Review) từ khách hàng đối với nhà hàng.
 */
public interface ReviewService {

    /**
     * Tạo một đánh giá mới cho nhà hàng.
     * Người tạo phải không phải là chủ nhà hàng và mỗi người dùng chỉ được đánh giá nhà hàng một lần duy nhất.
     *
     * @param restaurantId ID của nhà hàng được đánh giá
     * @param request thông tin đánh giá (bao gồm số sao rating và nội dung context)
     * @return ReviewResponse phản hồi chứa thông tin đánh giá đã tạo
     */
    ReviewResponse createReview(Long restaurantId, CreateReviewRequest request);

    /**
     * Lấy danh sách tất cả các đánh giá của một nhà hàng cụ thể.
     *
     * @param restaurantId ID của nhà hàng
     * @return List&lt;ReviewResponse&gt; danh sách các đánh giá của nhà hàng
     */
    List<ReviewResponse> getReviewsByRestaurant(Long restaurantId);

    /**
     * Lấy danh sách tất cả đánh giá trong toàn bộ hệ thống (dành cho quản trị viên).
     *
     * @return List&lt;ReviewResponse&gt; danh sách tất cả đánh giá
     */
    List<ReviewResponse> getAllReviews();

    /**
     * Lấy chi tiết một đánh giá bằng ID.
     *
     * @param reviewId ID của đánh giá
     * @return ReviewResponse thông tin đánh giá tìm thấy
     */
    ReviewResponse getReviewById(Long reviewId);

    /**
     * Cập nhật nội dung và số sao đánh giá của chính người dùng đã tạo.
     *
     * @param reviewId ID của đánh giá cần cập nhật
     * @param request thông tin đánh giá mới
     * @return ReviewResponse thông tin đánh giá sau khi cập nhật
     */
    ReviewResponse updateReview(Long reviewId, CreateReviewRequest request);

    /**
     * Người dùng tự xóa đánh giá của chính mình.
     *
     * @param reviewId ID của đánh giá cần xóa
     */
    void deleteReview(Long reviewId);

    /**
     * Quản trị viên xóa đánh giá bất kỳ trong hệ thống.
     *
     * @param reviewId ID của đánh giá cần xóa
     */
    void adminDeleteReview(Long reviewId);
}
