package com.teamg5.be.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateTypeRestaurantRequest {
    
    @NotBlank(message = "Tên không được để trống")
    private String name;

   private String description;
}
