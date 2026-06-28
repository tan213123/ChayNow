package com.teamg5.be.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "Request body for creating a new admin account")
public class CreateAdminRequest {
    @NotBlank(message = "Email không được để trống")
    @Email(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", message = "Định dạng email không hợp lệ")
    @Schema(description = "Admin's unique email address", example = "admin_new@chaynow.com")
    private String email;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 8, max = 12, message = "Mật khẩu phải từ 8 đến 12 ký tự")
    @Schema(description = "Admin's password (8 to 12 characters)", example = "admin123")
    private String password;

    @NotBlank(message = "Họ và tên không được để trống")
    @Schema(description = "Admin's full name", example = "System Admin 2")
    private String fullName;

    @Pattern(
            regexp = "^$|^(0|\\+84)(3|5|7|8|9)[0-9]{8}$",
            message = "Phone number is invalid. It should start with 0 or +84 followed by a valid prefix (3, 5, 7, 8, 9) and 8 digits."
    )
    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    @Schema(description = "Admin's phone number", example = "0987654321")
    private String phone;
}
