package com.teamg5.be.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "Request body for changing user password")
public class ChangePasswordRequest {
    @NotBlank(message = "Current password is required")
    @Schema(description = "User's current password", example = "oldPassword123")
    private String currentPassword;

    @NotBlank(message = "New password is required")
    @Size(min = 8, max = 12, message = "Password must be between 8 and 12 characters")
    @Schema(description = "User's new password", example = "newPassword123")
    private String newPassword;
}
