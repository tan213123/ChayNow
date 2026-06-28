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
    @NotBlank(message = "Name is required")
    @Size(max = 255, message = "Name must not exceed 255 characters")
    private String name;

    @NotBlank(message = "District is required")
    @Size(max = 255, message = "District must not exceed 255 characters")
    private String district;

    @NotBlank(message = "City is required")
    @Size(max = 255, message = "City must not exceed 255 characters")
    private String city;

    private String address;
    private Double latitude;
    private Double longitude;

    @Size(max = 1000, message = "Map URL must not exceed 1000 characters")
    private String mapUrl;

    private Boolean active;
}
