package com.teamg5.be.controller;

import com.teamg5.be.dto.AdminRestaurantResponseDTO;
import com.teamg5.be.dto.PageResponseDTO;
import com.teamg5.be.dto.RejectRestaurantRequestDTO;
import com.teamg5.be.service.AdminRestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/admin/restaurants")
@RequiredArgsConstructor
@Tag(name = "Admin Restaurant Management", description = "APIs dành cho Admin để quản lý danh sách và duyệt/từ chối nhà hàng/địa điểm")
public class AdminRestaurantController {

    private final AdminRestaurantService adminRestaurantService;

    @GetMapping
    @Operation(
        summary = "Lấy danh sách địa điểm/nhà hàng (Phân trang, Tìm kiếm, Lọc)",
        description = "API này dành cho Admin để xem danh sách nhà hàng. Hỗ trợ tìm kiếm theo tên hoặc địa chỉ, lọc theo trạng thái duyệt (PENDING, APPROVED, REJECTED), lọc theo khu vực (placeId) và phân trang dữ liệu."
    )
    public PageResponseDTO<AdminRestaurantResponseDTO> getAllRestaurantsForAdmin(
            @Parameter(description = "Từ khóa tìm kiếm (tên hoặc địa chỉ nhà hàng)", example = "chay")
            @RequestParam(required = false) String keyword,

            @Parameter(description = "Lọc theo trạng thái duyệt (Các giá trị: PENDING, APPROVED, REJECTED)", example = "PENDING")
            @RequestParam(required = false) String status,

            @Parameter(description = "Lọc theo ID khu vực/địa điểm", example = "3")
            @RequestParam(required = false) Long placeId,

            @Parameter(description = "Số trang cần lấy (bắt đầu từ 0)", example = "0")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Số lượng phần tử trên mỗi trang (tối đa 50, mặc định là 10)", example = "10")
            @RequestParam(defaultValue = "10") int size
    ) {
        return adminRestaurantService.getAllRestaurants(keyword, status, placeId, page, size);
    }

    @PutMapping("/{restaurantId}/approve")
    @Operation(
        summary = "Duyệt địa điểm/nhà hàng",
        description = "API này cho phép Admin duyệt một nhà hàng đang ở trạng thái PENDING thành APPROVED. Sau khi duyệt, nhà hàng sẽ được phép hiển thị trên trang public."
    )
    public AdminRestaurantResponseDTO approveRestaurant(
            @Parameter(description = "ID của nhà hàng cần duyệt", example = "1")
            @PathVariable Long restaurantId
    ) {
        return adminRestaurantService.approveRestaurant(restaurantId);
    }

    @PutMapping("/{restaurantId}/reject")
    @Operation(
        summary = "Từ chối duyệt địa điểm/nhà hàng",
        description = "API này cho phép Admin từ chối duyệt một nhà hàng và chuyển trạng thái thành REJECTED. Yêu cầu nhập lý do từ chối."
    )
    public AdminRestaurantResponseDTO rejectRestaurant(
            @Parameter(description = "ID của nhà hàng cần từ chối", example = "1")
            @PathVariable Long restaurantId,

            @RequestBody RejectRestaurantRequestDTO request
    ) {
        return adminRestaurantService.rejectRestaurant(restaurantId, request);
    }
}
