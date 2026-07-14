package com.teamg5.be.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "Request body for changing user password")
public class ChangePasswordRequest {
    @NotBlank(message = "Mật khẩu hiện tại không được để trống")
    @Schema(description = "User's current password", example = "oldPassword123")
    private String currentPassword;

    @NotBlank(message = "Mật khẩu mới không được để trống")
    @Size(min = 8, max = 12, message = "Mật khẩu phải từ 8 đến 12 ký tự")
    @Schema(description = "User's new password", example = "newPassword123")
    private String newPassword;
}
