package com.teamg5.be.service;

import com.teamg5.be.dto.PageResponseDTO;
import com.teamg5.be.dto.PostingResponse;
import com.teamg5.be.dto.UpdatePostingRequest;

/**
 * Service interface quản lý các bài đăng (Posting) của chủ nhà hàng (Owner).
 */
public interface PostingService {

    /**
     * Lấy danh sách bài đăng của chủ nhà hàng đang đăng nhập với bộ lọc trạng thái, từ khóa và nhà hàng cụ thể.
     *
     * @param status trạng thái của bài đăng (ví dụ: PENDING, APPROVED, REJECTED)
     * @param keyword từ khóa tìm kiếm trong tiêu đề bài đăng
     * @param restaurantId ID của nhà hàng liên kết cụ thể
     * @param page số trang hiện tại
     * @param size kích thước trang
     * @return PageResponseDTO chứa danh sách phản hồi bài đăng
     */
    PageResponseDTO<PostingResponse> getMyPostings(
            String status,
            String keyword,
            Long restaurantId,
            int page,
            int size
    );

    /**
     * Lấy danh sách các bài đăng đã duyệt để hiển thị công khai cho người dùng cuối.
     * Hỗ trợ tìm kiếm từ khóa, phân loại món ăn, nhà hàng và địa điểm.
     *
     * @param keyword từ khóa tìm kiếm
     * @param categoryId danh mục món ăn (FoodCategory) dưới dạng chuỗi
     * @param restaurantId ID của nhà hàng liên kết
     * @param placeId ID của địa điểm liên kết
     * @param page số trang hiện tại
     * @param size kích thước trang
     * @return PageResponseDTO chứa danh sách bài đăng công khai
     */
    PageResponseDTO<PostingResponse> getPublicPostings(
            String keyword,
            String categoryId,
            Long restaurantId,
            Long placeId,
            int page,
            int size
    );

    /**
     * Lấy chi tiết một bài đăng đã duyệt hiển thị công khai.
     *
     * @param postingId ID của bài đăng
     * @return PostingResponse chứa chi tiết bài đăng
     */
    PostingResponse getPublicPostingDetail(Long postingId);

    /**
     * Cập nhật thông tin bài đăng của chính chủ sở hữu đăng nhập (chỉ áp dụng khi bài đăng chưa được duyệt).
     *
     * @param postingId ID của bài đăng cần cập nhật
     * @param request yêu cầu cập nhật chứa các thông tin mới
     * @return PostingResponse chứa thông tin bài đăng sau cập nhật
     */
    PostingResponse updateMyPosting(Long postingId, UpdatePostingRequest request);

    /**
     * Xóa bài đăng thuộc quyền sở hữu của người dùng hiện tại.
     *
     * @param postingId ID của bài đăng cần xóa
     */
    void deleteMyPosting(Long postingId);

    /**
     * Gửi lại yêu cầu duyệt bài đăng sau khi bị từ chối duyệt (chỉ áp dụng cho trạng thái REJECTED).
     * Trạng thái bài đăng sẽ được chuyển về PENDING.
     *
     * @param postingId ID của bài đăng cần gửi lại duyệt
     * @return PostingResponse chứa thông tin bài đăng sau khi gửi lại
     */
    PostingResponse resubmitMyPosting(Long postingId);
}
