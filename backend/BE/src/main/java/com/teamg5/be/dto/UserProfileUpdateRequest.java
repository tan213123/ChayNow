package com.teamg5.be.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "Request body for updating user's own profile")
public class UserProfileUpdateRequest {
    @Size(max = 255, message = "Full name must not exceed 255 characters")
    @Schema(description = "User's full name", example = "Nguyễn Văn A")
    private String fullName;

    @jakarta.validation.constraints.Email(message = "Email không hợp lệ")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    @Schema(description = "User's email", example = "test@example.com")
    private String email;

    @Pattern(
            regexp = "^$|^(0|\\+84)(3|5|7|8|9)[0-9]{8}$",
            message = "Phone number is invalid. It should start with 0 or +84 followed by a valid prefix (3, 5, 7, 8, 9) and 8 digits."
    )
    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    @Schema(description = "User's phone number", example = "0987654321")
    private String phone;

    @Size(max = 500, message = "Avatar URL must not exceed 500 characters")
    @Schema(description = "User's avatar URL", example = "http://example.com/avatar.jpg")
    private String avatarUrl;

    @Size(max = 1000, message = "Bio must not exceed 1000 characters")
    @Schema(description = "User's bio description", example = "Yêu thích ẩm thực chay")
    private String bio;
}
