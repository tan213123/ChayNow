package com.teamg5.be.dto;



import com.teamg5.be.entity.Place;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@Builder
public class UpdateRestaurantRequest {
  
    private String Name;
    private String address;
    private String description;
    @Pattern(
            regexp = "^$|^(0|\\+84)[0-9]{8,10}$",
            message = "Phone number inValidate"
    )
    private String phoneNumber;
    private Long placeId;
    private Long typeRestaurantId;
    private LocalTime openTime;
   
    private LocalTime closedTime;
    private List<String> mediaUrls;


   
    
}
