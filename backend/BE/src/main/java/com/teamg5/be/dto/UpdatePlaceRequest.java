package com.teamg5.be.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class UpdatePlaceRequest {
    
    @Size(max = 255, message = "Tên địa điểm không được vượt quá 255 ký tự")
    private String name;

    @Size(max = 255, message = "Quận/huyện không được vượt quá 255 ký tự")
   
    private String district;

    @Size(max = 255, message = "Thành phố không được vượt quá 255 ký tự")
    
    private String city;

    @Size(max = 500, message = "Địa chỉ không được vượt quá 500 ký tự")

    private String address;

    @Size(max = 1000, message = "Đường dẫn bản đồ không được vượt quá 1000 ký tự")
    private String mapUrl;
}
