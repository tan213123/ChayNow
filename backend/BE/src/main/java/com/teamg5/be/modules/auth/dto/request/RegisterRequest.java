package com.teamg5.be.modules.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "Request body for user registration")
public class RegisterRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Schema(description = "User's unique email address", example = "newuser@example.com")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 12, message = "Password must be between 8 and 12 characters")
    @Schema(description = "User's password (8 to 12 characters)", example = "securePass12")
    private String password;

    @NotBlank(message = "Full name is required")
    @Schema(description = "User's full name", example = "John Doe")
    private String fullName;
}
