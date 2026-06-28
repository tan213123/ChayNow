package com.teamg5.be.service;

import com.teamg5.be.dto.CreateTypeRestaurantRequest;
import com.teamg5.be.dto.TypeRestaurantResponse;

import java.util.List;

/**
 * Service interface quản lý loại hình nhà hàng (TypeRestaurant).
 */
public interface TypeRestaurantService {

    /**
     * Tạo mới một loại hình nhà hàng (ví dụ: Nhà hàng chay, Quán cơm chay, lẩu chay...).
     * Kiểm tra xem tên loại hình đã tồn tại chưa để tránh trùng lặp.
     *
     * @param request yêu cầu tạo loại hình chứa thông tin tên và mô tả
     * @return TypeRestaurantResponse phản hồi chứa thông tin loại hình đã tạo
     */
    TypeRestaurantResponse createdTypeRestaurant(CreateTypeRestaurantRequest request);

    /**
     * Lấy danh sách tất cả các loại hình nhà hàng có trong hệ thống.
     *
     * @return List&lt;TypeRestaurantResponse&gt; danh sách các loại hình nhà hàng
     */
    List<TypeRestaurantResponse> getAllTypeRestaurant();

    /**
     * Lấy thông tin chi tiết một loại hình nhà hàng bằng ID.
     *
     * @param typeRestaurantId ID của loại hình nhà hàng
     * @return TypeRestaurantResponse thông tin loại hình nhà hàng tìm thấy
     */
    TypeRestaurantResponse getTypeRestaurantById(Long typeRestaurantId);

    /**
     * Cập nhật thông tin tên và mô tả của loại hình nhà hàng.
     * Nếu tên được thay đổi, kiểm tra xem tên mới đã tồn tại hay chưa.
     *
     * @param id ID của loại hình cần cập nhật
     * @param request thông tin mới cần cập nhật
     * @return TypeRestaurantResponse thông tin loại hình sau khi cập nhật
     */
    TypeRestaurantResponse updateTypeRestaurant(Long id, CreateTypeRestaurantRequest request);

    /**
     * Xóa một loại hình nhà hàng bằng ID.
     * Chỉ cho phép xóa nếu loại hình nhà hàng đó không chứa bất kỳ nhà hàng nào đang liên kết.
     *
     * @param id ID của loại hình cần xóa
     */
    void deleteTypeRestaurant(Long id);
}
