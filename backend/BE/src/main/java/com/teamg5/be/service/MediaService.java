package com.teamg5.be.service;

import com.teamg5.be.dto.MediaResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Service interface quản lý các thao tác tải lên và lưu trữ phương tiện truyền thông (Media - Hình ảnh/Video).
 */
public interface MediaService {

    /**
     * Tải lên một tệp tin duy nhất lên Cloudinary và lưu vào cơ sở dữ liệu liên kết với Nhà hàng.
     *
     * @param file tệp tin phương tiện cần tải lên
     * @param restaurantId ID của nhà hàng liên kết
     * @return MediaResponse phản hồi chứa thông tin phương tiện đã lưu
     */
    MediaResponse uploadFile(MultipartFile file, Long restaurantId);

    /**
     * Tải lên một tệp tin duy nhất lên Cloudinary và lưu liên kết với Nhà hàng và/hoặc Đánh giá.
     *
     * @param file tệp tin phương tiện cần tải lên
     * @param restaurantId ID của nhà hàng liên kết (có thể null)
     * @param reviewId ID của đánh giá liên kết (có thể null)
     * @return MediaResponse phản hồi chứa thông tin phương tiện đã lưu
     */
    MediaResponse uploadFile(MultipartFile file, Long restaurantId, Long reviewId);

    /**
     * Tải lên nhiều tệp tin phương tiện lên Cloudinary và liên kết với Nhà hàng.
     *
     * @param files danh sách các tệp tin phương tiện cần tải lên
     * @param restaurantId ID của nhà hàng liên kết
     * @return List<MediaResponse> danh sách phản hồi chứa thông tin các phương tiện đã lưu
     */
    List<MediaResponse> uploadFiles(MultipartFile[] files, Long restaurantId);

    /**
     * Tải lên nhiều tệp tin phương tiện lên Cloudinary và liên kết với Nhà hàng và/hoặc Đánh giá.
     *
     * @param files danh sách các tệp tin phương tiện cần tải lên
     * @param restaurantId ID của nhà hàng liên kết (có thể null)
     * @param reviewId ID của đánh giá liên kết (có thể null)
     * @return List<MediaResponse> danh sách phản hồi chứa thông tin các phương tiện đã lưu
     */
    List<MediaResponse> uploadFiles(MultipartFile[] files, Long restaurantId, Long reviewId);

    /**
     * Tải ảnh lên Cloudinary và chỉ lấy URL (không lưu db).
     */
    String uploadImageOnly(MultipartFile file);
}
