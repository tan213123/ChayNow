package com.teamg5.be.controller;

import com.teamg5.be.dto.ApiResponse;
import com.teamg5.be.dto.UserProfileResponse;
import com.teamg5.be.dto.UserProfileUpdateRequest;
import com.teamg5.be.dto.ChangePasswordRequest;
import com.teamg5.be.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User Profile Management", description = "APIs for users to view, update profile, and change password")
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    @Operation(summary = "Lấy thông tin cá nhân", description = "Lấy thông tin profile của người dùng đang đăng nhập dựa trên token.")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile() {
        UserProfileResponse response = userService.getMyProfile();
        return ResponseEntity.ok(ApiResponse.<UserProfileResponse>builder()
                .success(true)
                .message("Get profile successfully")
                .data(response)
                .build());
    }

    @PutMapping("/profile")
    @Operation(summary = "Cập nhật thông tin cá nhân", description = "Cập nhật thông tin profile của người dùng đang đăng nhập. Cho phép cập nhật từng phần (partial update).")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(@Valid @RequestBody UserProfileUpdateRequest request) {
        UserProfileResponse response = userService.updateMyProfile(request);
        return ResponseEntity.ok(ApiResponse.<UserProfileResponse>builder()
                .success(true)
                .message("Profile updated successfully")
                .data(response)
                .build());
    }

    @PutMapping("/profile/change-password")
    @Operation(summary = "Thay đổi mật khẩu", description = "Thay đổi mật khẩu tài khoản của người dùng đang đăng nhập.")
    public ResponseEntity<ApiResponse<Void>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(request);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Password changed successfully")
                .data(null)
                .build());
    }
}
