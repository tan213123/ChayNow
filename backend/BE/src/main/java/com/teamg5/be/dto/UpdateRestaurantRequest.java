package com.teamg5.be.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRestaurantRequest {
  
    @Size(max = 255, message = "Restaurant name must not exceed 255 characters")
    private String name;

    @Size(max = 500, message = "Address must not exceed 500 characters")
    private String address;

    @Size(max = 5000, message = "Description must not exceed 5000 characters")
    private String description;

    @Pattern(
            regexp = "^$|^(0|\\+84)(3|5|7|8|9)[0-9]{8}$",
            message = "Phone number is invalid. It should start with 0 or +84 followed by a valid prefix (3, 5, 7, 8, 9) and 8 digits."
    )
    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    private String phoneNumber;

    private Long placeId;
    private Long typeRestaurantId;
    private LocalTime openTime;
    private LocalTime closedTime;
    private List<Long> mediaIds;
}
