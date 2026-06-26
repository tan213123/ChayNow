package com.teamg5.be.service;

import com.teamg5.be.dto.AdminUserResponseDTO;
import com.teamg5.be.dto.AdminUserDetailResponse;
import com.teamg5.be.dto.PageResponse;
import com.teamg5.be.dto.CreateAdminRequest;
import com.teamg5.be.dto.UpdateUserRequest;

import com.teamg5.be.dto.DashboardStatsResponse;

public interface AdminUserService {
    PageResponse<AdminUserResponseDTO> getAllUsers(
            int page,
            int size,
            String keyword,
            String role,
            String status
    );

    AdminUserDetailResponse getUserById(Long userId);
    AdminUserDetailResponse updateUser(Long userId, UpdateUserRequest request);
    void deleteUser(Long userId);

    void suspendUser(Long userId);
    void activateUser(Long userId);
    AdminUserResponseDTO createAdmin(CreateAdminRequest request);
    DashboardStatsResponse getDashboardStats();
}
