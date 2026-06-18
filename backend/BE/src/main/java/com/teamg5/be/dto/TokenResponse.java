package com.teamg5.be.dto;

import com.teamg5.be.entity.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Response containing JWT token and user profile details after successful authentication")
public class TokenResponse {
    @Schema(description = "JWT access token", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String accessToken;

    @Schema(description = "Token type (Bearer)", example = "Bearer")
    private String tokenType;

    @Schema(description = "Expiration time in seconds", example = "86400")
    private long expiresIn;

    @Schema(description = "User's email address", example = "user@example.com")
    private String email;

    @Schema(description = "User's full name", example = "John Doe")
    private String fullName;

    @Schema(description = "User's system role", example = "USER")
    private Role role;

    @Schema(description = "User ID", example = "1")
    private Long id;

    @Schema(description = "User avatar URL", example = "http://example.com/avatar.jpg")
    private String avtUrl;

    @Schema(description = "User account status", example = "ACTIVE")
    private com.teamg5.be.entity.AccountStatus status;
}
