package com.teamg5.be.service;

import com.teamg5.be.dto.CreateRestaurantRequest;
import com.teamg5.be.dto.RestaurantResponse;
import com.teamg5.be.dto.UpdateRestaurantRequest;

import java.util.List;

/**
 * Service interface quản lý thông tin nhà hàng (Restaurant).
 */
public interface RestaurantService {

    /**
     * Tạo một nhà hàng mới liên kết với người dùng (chủ nhà hàng) đang đăng nhập.
     *
     * @param request yêu cầu tạo nhà hàng chứa thông tin chi tiết
     * @return RestaurantResponse chứa thông tin nhà hàng đã tạo
     */
    RestaurantResponse createdRestaurant(CreateRestaurantRequest request);

    /**
     * Lấy chi tiết thông tin một nhà hàng đang hoạt động (active = true) theo ID.
     *
     * @param restaurantId ID của nhà hàng
     * @return RestaurantResponse chứa thông tin nhà hàng tìm thấy
     */
    RestaurantResponse getRestaurantById(Long restaurantId);

    /**
     * Lấy danh sách tất cả các nhà hàng đang hoạt động trong hệ thống.
     *
     * @return List&lt;RestaurantResponse&gt; danh sách các nhà hàng đang hoạt động
     */
    List<RestaurantResponse> getAllRestaurant();

    /**
     * Cập nhật thông tin chi tiết của một nhà hàng cụ thể.
     *
     * @param restaurantId ID của nhà hàng cần cập nhật
     * @param request yêu cầu cập nhật chứa các thông tin mới
     * @return RestaurantResponse chứa thông tin nhà hàng sau khi cập nhật
     */
    RestaurantResponse updateResponse(Long restaurantId, UpdateRestaurantRequest request);

    /**
     * Thay đổi trạng thái hoạt động (active) của nhà hàng (soft delete hoặc khôi phục hoạt động).
     *
     * @param restaurantId ID của nhà hàng
     */
    void softDeleteRestaurant(Long restaurantId);

    /**
     * Lấy danh sách tất cả nhà hàng đang hoạt động thuộc sở hữu của chủ nhà hàng đang đăng nhập hiện tại.
     *
     * @return List&lt;RestaurantResponse&gt; danh sách nhà hàng của tôi
     */
    List<RestaurantResponse> getMyRestaurants();

    /**
     * Lấy danh sách tất cả nhà hàng đang hoạt động của một người dùng cụ thể bằng ID (dành cho quản trị viên).
     *
     * @param userId ID của người dùng (chủ nhà hàng)
     * @return List&lt;RestaurantResponse&gt; danh sách nhà hàng liên kết với người dùng đó
     */
    List<RestaurantResponse> getRestaurantsByUserId(Long userId);
}
