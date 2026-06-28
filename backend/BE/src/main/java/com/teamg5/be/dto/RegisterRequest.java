package com.teamg5.be.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "Request body for user registration")
public class RegisterRequest {
    @NotBlank(message = "Email không được để trống")
    @Email(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", message = "Định dạng email không hợp lệ")
    @Schema(description = "User's unique email address", example = "newuser@example.com")
    private String email;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 8, max = 12, message = "Mật khẩu phải từ 8 đến 12 ký tự")
    @Schema(description = "User's password (8 to 12 characters)", example = "securePass12")
    private String password;

    @NotBlank(message = "Họ và tên không được để trống")
    @Schema(description = "User's full name", example = "John Doe")
    private String fullName;
}
