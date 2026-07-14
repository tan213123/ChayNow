package com.teamg5.be.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateFoodPostRequest {

    @NotNull(message = "Mã nhà hàng không được để trống")
    private Long restaurantId;

    @NotBlank(message = "Tên không được để trống")
    @Size(min = 2, max = 100, message = "Tên phải từ 2 đến 100 ký tự")
    private String name;

    @NotBlank(message = "Danh mục không được để trống")
    private String category;

    @NotBlank(message = "Mô tả không được để trống")
    @Size(min = 10, max = 1000, message = "Mô tả phải từ 10 đến 1000 ký tự")
    private String description;

    @NotBlank(message = "Đường dẫn ảnh không được để trống")
    @Pattern(regexp = "^(https?|ftp|file)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]$", message = "Đường dẫn ảnh phải là một URL hợp lệ")
    private String imageUrl;
}
