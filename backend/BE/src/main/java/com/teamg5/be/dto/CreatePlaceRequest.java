package com.teamg5.be.dto;

import jakarta.validation.constraints.NotBlank;
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
    private String name;

    @NotBlank(message = "District is required")
    private String district;

    @NotBlank(message = "City is required")
    private String city;

    private String address;
    private Double latitude;
    private Double longitude;
    private String mapUrl;
    private Boolean active;
}
