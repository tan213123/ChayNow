package com.teamg5.be.dto;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalTime;

@Getter
@Setter
public class CreateRestaurantRequest {
    @NotBlank(message = "Tên nhà hàng không được để trống")
    private String name;

    @Size(max = 500, message = "Address must not exceed 500 characters")
    private String address;

    @Pattern(
            regexp = "^$|^(0|\\+84)(3|5|7|8|9)[0-9]{8}$",
            message = "Số điện thoại không hợp lệ. Phải bắt đầu bằng 0 hoặc +84, theo sau bởi các đầu số hợp lệ (3, 5, 7, 8, 9) và có 8 chữ số."
    )
    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    private String phoneNumber;
    
    @Size(max = 5000, message = "Description must not exceed 5000 characters")
    private String description;

    @NotNull(message = "Địa điểm không được để trống!")
    private Long placeId;

    @NotNull(message = "Mã loại nhà hàng không được để trống")
    private Long typeRestaurantId;
    @NotNull(message = "Giờ mở cửa không được để trống")
    private LocalTime openTime;
    @NotNull(message = "Giờ đóng cửa không được để trống")
    private LocalTime closedTime;
}
