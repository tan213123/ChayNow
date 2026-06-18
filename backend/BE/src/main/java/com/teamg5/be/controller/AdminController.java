package com.teamg5.be.controller;

import com.teamg5.be.dto.AdminUserResponseDTO;
import com.teamg5.be.service.AdminUserService;
import com.teamg5.be.dto.PageResponse;
import com.teamg5.be.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.teamg5.be.dto.CreateAdminRequest;
import com.teamg5.be.dto.DashboardStatsResponse;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin Management", description = "APIs for administrator management functions")
public class AdminController {

    private final AdminUserService adminUserService;

    @GetMapping("/users")
    // @PreAuthorize("hasRole('ADMIN')")
    @Operation(
        summary = "Tìm kiếm và lọc danh sách người dùng (Phân trang)",
        description = "API này dành cho Admin để quản lý danh sách người dùng. Hỗ trợ tìm kiếm theo Tên (fullName) hoặc Email (chấp nhận tìm kiếm một phần, không phân biệt hoa thường), lọc theo vai trò (role: USER, OWNER, ADMIN), lọc theo trạng thái tài khoản (status: ACTIVE, SUSPENDED, PENDING) và phân trang dữ liệu."
    )
    public ResponseEntity<ApiResponse<PageResponse<AdminUserResponseDTO>>> getAllUsers(
            @Parameter(description = "Số trang cần lấy (bắt đầu từ 0)", example = "0")
            @RequestParam(name = "page", defaultValue = "0") int page,

            @Parameter(description = "Số lượng người dùng trên một trang", example = "6")
            @RequestParam(name = "size", defaultValue = "6") int size,

            @Parameter(description = "Từ khóa tìm kiếm (so khớp theo Tên hoặc Email, không phân biệt hoa thường, hỗ trợ tìm kiếm một phần)", example = "An")
            @RequestParam(name = "keyword", required = false, defaultValue = "") String keyword,

            @Parameter(description = "Lọc danh sách theo vai trò (Các giá trị hợp lệ: USER, OWNER, ADMIN)", example = "USER")
            @RequestParam(name = "role", required = false, defaultValue = "") String role,

            @Parameter(description = "Lọc danh sách theo trạng thái tài khoản (Các giá trị hợp lệ: ACTIVE, SUSPENDED, PENDING)", example = "ACTIVE")
            @RequestParam(name = "status", required = false, defaultValue = "") String status
    ) {
        PageResponse<AdminUserResponseDTO> response = adminUserService.getAllUsers(page, size, keyword, role, status);
        return ResponseEntity.ok(ApiResponse.<PageResponse<AdminUserResponseDTO>>builder()
                .success(true)
                .message("Get all users successfully")
                .data(response)
                .build());
    }

    @PatchMapping("/users/{id}/suspend")
    @Operation(summary = "Đình chỉ người dùng", description = "Thay đổi trạng thái tài khoản của người dùng thành SUSPENDED.")
    public ResponseEntity<ApiResponse<Void>> suspendUser(
            @PathVariable(name = "id") Long id
    ) {
        adminUserService.suspendUser(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("User suspended successfully")
                .build());
    }

    @PatchMapping("/users/{id}/activate")
    @Operation(summary = "Kích hoạt người dùng", description = "Thay đổi trạng thái tài khoản của người dùng thành ACTIVE.")
    public ResponseEntity<ApiResponse<Void>> activateUser(
            @PathVariable(name = "id") Long id
    ) {
        adminUserService.activateUser(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("User activated successfully")
                .build());
    }

    @PostMapping("/create")
    @Operation(summary = "Tạo tài khoản Admin mới", description = "Được thực hiện bởi một Admin khác đã đăng nhập.")
    public ResponseEntity<ApiResponse<AdminUserResponseDTO>> createAdmin(
            @jakarta.validation.Valid @RequestBody CreateAdminRequest request
    ) {
        AdminUserResponseDTO response = adminUserService.createAdmin(request);
        return ResponseEntity.ok(ApiResponse.<AdminUserResponseDTO>builder()
                .success(true)
                .message("Admin account created successfully")
                .data(response)
                .build());
    }

    @GetMapping("/dashboard/stats")
    @Operation(summary = "Lấy dữ liệu thống kê tổng quan hệ thống cho Admin Dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        DashboardStatsResponse response = adminUserService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.<DashboardStatsResponse>builder()
                .success(true)
                .message("Get dashboard statistics successfully")
                .data(response)
                .build());
    }
}
