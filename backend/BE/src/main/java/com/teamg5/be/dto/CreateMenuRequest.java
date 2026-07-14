package com.teamg5.be.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateMenuRequest {
    @NotBlank(message = "Tên món ăn không được để trống")
    @Size(max = 255, message = "Tên món ăn không được vượt quá 255 ký tự")
    private String name;

    @Size(max = 500, message = "Mô tả không được vượt quá 500 ký tự")
    private String description;

    @NotNull(message = "Giá món ăn không được để trống")
    @Min(value = 0, message = "Giá món ăn không được nhỏ hơn 0đ")
    private Integer price;

    @Size(max = 100, message = "Danh mục không được vượt quá 100 ký tự")
    private String category;

    @Size(max = 1000, message = "Đường dẫn không được vượt quá 1000 ký tự")
    private String imageUrl;

    private Boolean available;

    private Boolean featured;
}
