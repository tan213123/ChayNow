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
    @NotBlank(message = "Name of restaurant is required")
    @Size(max = 255, message = "Restaurant name must not exceed 255 characters")
    private String name;

    @Size(max = 500, message = "Address must not exceed 500 characters")
    private String address;

    @Pattern(
            regexp = "^$|^(0|\\+84)(3|5|7|8|9)[0-9]{8}$",
            message = "Phone number is invalid. It should start with 0 or +84 followed by a valid prefix (3, 5, 7, 8, 9) and 8 digits."
    )
    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    private String phoneNumber;
    
    @Size(max = 5000, message = "Description must not exceed 5000 characters")
    private String description;

    @NotNull(message = "Place cannot null!")
    private Long placeId;

    @NotNull(message = "Type restaurant ID is required")
    private Long typeRestaurantId;

    @NotNull(message = "Open time cannot null")
    private LocalTime openTime;

    @NotNull(message = "Closed time cannot null")
    private LocalTime closedTime;
}
