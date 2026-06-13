package com.teamg5.be.service;

import com.teamg5.be.dto.AdminUserResponseDTO;
import com.teamg5.be.dto.PageResponse;

public interface AdminUserService {
    PageResponse<AdminUserResponseDTO> getAllUsers(
            int page,
            int size,
            String keyword,
            String role,
            String status
    );

    void suspendUser(Long userId);
    void activateUser(Long userId);
}
