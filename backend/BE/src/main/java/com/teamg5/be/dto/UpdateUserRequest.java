package com.teamg5.be.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Request body for updating user information by Admin")
public class UpdateUserRequest {

    @Schema(description = "User's full name", example = "Trần Văn B")
    private String fullName;

    @Schema(description = "User's phone number", example = "0912345678")
    private String phone;

    @Schema(description = "User's role (USER, OWNER, ADMIN)", example = "USER")
    private String role;

    @Schema(description = "User's account status (ACTIVE, SUSPENDED, PENDING)", example = "ACTIVE")
    private String status;
}
