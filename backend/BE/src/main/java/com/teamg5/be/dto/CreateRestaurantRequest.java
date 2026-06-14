package com.teamg5.be.dto;
import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
@Getter
@Setter
public class CreateRestaurantRequest {
    @NotBlank(message = "Name of restaurant is required")
    private String name;
    private String address;

    @Pattern(
            regexp = "^(0|\\+84)[0-9]{8,10}$",
            message = "Phone number are invalid. It should start with 0 or +84 and contain 9 to 11 digits."
    )
    private String phoneNumber;
    
    private String description;

    @NotNull(message = "Place cannot null!")
    private Long placeId;

    @NotNull(message = "Type restaurant ID is required")
    private Long typeRestaurantId;
    @NotNull(message = "Open time cannot null")
    private LocalTime openTime;
    @NotNull(message = "Closed time cannot null")
    private LocalTime closedTime;

    private List<String> mediaUrls;

}
