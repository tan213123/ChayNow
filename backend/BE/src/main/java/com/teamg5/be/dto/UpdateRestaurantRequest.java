package com.teamg5.be.dto;



import com.teamg5.be.entity.Place;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRestaurantRequest {
  
    private String name;
    private String address;
    private String description;
    @Pattern(
            regexp = "^$|^(0|\\+84)(3|5|7|8|9)[0-9]{8}$",
            message = "Phone number is invalid. It should start with 0 or +84 followed by a valid prefix (3, 5, 7, 8, 9) and 8 digits."
    )
    private String phoneNumber;
    private Long placeId;
    private Long typeRestaurantId;
    private LocalTime openTime;
    private LocalTime closedTime;
    private List<Long> mediaIds;


   
    
}
