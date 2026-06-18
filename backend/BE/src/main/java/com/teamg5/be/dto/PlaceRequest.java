package com.teamg5.be.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlaceRequest {
     @NotBlank(message = "Tên địa điểm không được để trống")
    @Size(max = 255, message = "Tên địa điểm không được vượt quá 255 ký tự")
    private String name;

    @Size(max = 255, message = "Quận/huyện không được vượt quá 255 ký tự")
    @NotBlank
    private String district;

    @Size(max = 255, message = "Thành phố không được vượt quá 255 ký tự")
    @NotBlank
    private String city;

    @Size(max = 500, message = "Địa chỉ không được vượt quá 500 ký tự")
    @NotBlank
    private String address;

    // @DecimalMin(value = "-90.0", message = "Vĩ độ phải lớn hơn hoặc bằng -90")
    // @DecimalMax(value = "90.0", message = "Vĩ độ phải nhỏ hơn hoặc bằng 90")
    // private Double latitude;

    // @DecimalMin(value = "-180.0", message = "Kinh độ phải lớn hơn hoặc bằng -180")
    // @DecimalMax(value = "180.0", message = "Kinh độ phải nhỏ hơn hoặc bằng 180")
    // private Double longitude;

    @Size(max = 1000, message = "Đường dẫn bản đồ không được vượt quá 1000 ký tự")
    private String mapUrl;
}
