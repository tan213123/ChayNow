package com.teamg5.be.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserDetailResponse {
    private Long id;
    private String fullName;
    private String email;
    private String avatarUrl;
    private String phone;
    private String bio;
    private String role;
    private String status;
    private int warningCount;
    private int reviewCount;
    private String createdAt;
    private String updatedAt;
}
