package com.teamg5.be.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "Request body for creating a new admin account")
public class CreateAdminRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Schema(description = "Admin's unique email address", example = "admin_new@chaynow.com")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 12, message = "Password must be between 8 and 12 characters")
    @Schema(description = "Admin's password (8 to 12 characters)", example = "admin123")
    private String password;

    @NotBlank(message = "Full name is required")
    @Schema(description = "Admin's full name", example = "System Admin 2")
    private String fullName;

    @Schema(description = "Admin's phone number", example = "0987654321")
    private String phone;
}
