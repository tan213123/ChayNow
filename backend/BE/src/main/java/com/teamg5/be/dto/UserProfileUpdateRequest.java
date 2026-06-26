package com.teamg5.be.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Request body for updating user's own profile")
public class UserProfileUpdateRequest {
    @Schema(description = "User's full name", example = "Nguyễn Văn A")
    private String fullName;

    @Schema(description = "User's phone number", example = "0987654321")
    private String phone;

    @Schema(description = "User's avatar URL", example = "http://example.com/avatar.jpg")
    private String avatarUrl;

    @Schema(description = "User's bio description", example = "Yêu thích ẩm thực chay")
    private String bio;
}
