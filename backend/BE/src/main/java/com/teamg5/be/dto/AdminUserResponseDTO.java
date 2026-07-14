package com.teamg5.be.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserResponseDTO {
    private Long id;
    private String fullName;
    private String email;
    private String avatarUrl;
    private String role;
    private String status;
    private Integer reviewCount;
    private String joinedDate;
}
