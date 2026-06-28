package com.teamg5.be.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateTypeRestaurantRequest {
    
    @NotBlank(message = "Tên không được để trống")
    private String name;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;
}
