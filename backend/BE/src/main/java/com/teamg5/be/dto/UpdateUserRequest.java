package com.teamg5.be.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "Request body for updating user information by Admin")
public class UpdateUserRequest {

    @Size(max = 255, message = "Full name must not exceed 255 characters")
    @Schema(description = "User's full name", example = "Trần Văn B")
    private String fullName;

    @Pattern(
            regexp = "^$|^(0|\\+84)(3|5|7|8|9)[0-9]{8}$",
            message = "Phone number is invalid. It should start with 0 or +84 followed by a valid prefix (3, 5, 7, 8, 9) and 8 digits."
    )
    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    @Schema(description = "User's phone number", example = "0912345678")
    private String phone;

    @Size(max = 50, message = "Role must not exceed 50 characters")
    @Schema(description = "User's role (USER, OWNER, ADMIN)", example = "USER")
    private String role;

    @Size(max = 50, message = "Status must not exceed 50 characters")
    @Schema(description = "User's account status (ACTIVE, SUSPENDED, PENDING)", example = "ACTIVE")
    private String status;
}
