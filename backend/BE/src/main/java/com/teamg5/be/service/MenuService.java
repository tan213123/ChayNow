package com.teamg5.be.service;

import com.teamg5.be.dto.CreateMenuRequest;
import com.teamg5.be.dto.MenuResponse;
import com.teamg5.be.dto.UpdateMenuRequest;

import java.util.List;

/**
 * Service interface quản lý thực đơn (Menu) của nhà hàng.
 */
public interface MenuService {

    /**
     * Tạo một món ăn mới trong thực đơn của nhà hàng.
     *
     * @param restaurantId ID của nhà hàng cần thêm thực đơn
     * @param request yêu cầu tạo thực đơn chứa thông tin món ăn
     * @return MenuResponse chứa thông tin thực đơn đã tạo
     */
    MenuResponse createMenu(Long restaurantId, CreateMenuRequest request);

    /**
     * Lấy chi tiết một món ăn trong thực đơn bằng ID.
     *
     * @param menuId ID của món ăn
     * @return MenuResponse chứa thông tin món ăn tìm thấy
     */
    MenuResponse getMenuById(Long menuId);

    /**
     * Lấy danh sách tất cả các món ăn đang hoạt động (active = true) trong hệ thống.
     *
     * @return List&lt;MenuResponse&gt; danh sách thực đơn toàn hệ thống
     */
    List<MenuResponse> getAllMenus();

    /**
     * Lấy danh sách các món ăn trong thực đơn đang hoạt động của một nhà hàng cụ thể.
     *
     * @param restaurantId ID của nhà hàng
     * @return List&lt;MenuResponse&gt; danh sách món ăn thuộc nhà hàng
     */
    List<MenuResponse> getMenusByRestaurant(Long restaurantId);

    /**
     * Cập nhật thông tin chi tiết một món ăn trong thực đơn.
     *
     * @param menuId ID của món ăn cần cập nhật
     * @param request yêu cầu cập nhật chứa thông tin mới của món ăn
     * @return MenuResponse chứa thông tin món ăn sau cập nhật
     */
    MenuResponse updateMenu(Long menuId, UpdateMenuRequest request);

    /**
     * Thay đổi trạng thái hoạt động (active), khả dụng (available) và nổi bật (featured) của món ăn (soft delete).
     *
     * @param menuId ID của món ăn cần thay đổi trạng thái
     */
    void softDeleteMenu(Long menuId);
}
