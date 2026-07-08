package com.teamg5.be.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private Long id;
    private String email;
    private Boolean isEmailVerified;
    private String fullName;
    private String role;
    private String status;
    private String phone;
    private String avatarUrl;
    private String bio;
    private int warningCount;
    private String createdAt;
    private String updatedAt;
}
