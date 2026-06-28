package com.teamg5.be.dto;

import jakarta.validation.constraints.NotBlank;
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
public class CreatePlaceRequest {
    @NotBlank(message = "Tên địa điểm không được để trống")
    private String name;

    @NotBlank(message = "Quận/huyện không được để trống")
    private String district;

    @NotBlank(message = "Thành phố không được để trống")
    private String city;

    private String address;
    private Double latitude;
    private Double longitude;

    @Size(max = 1000, message = "Map URL must not exceed 1000 characters")
    private String mapUrl;

    private Boolean active;
}
