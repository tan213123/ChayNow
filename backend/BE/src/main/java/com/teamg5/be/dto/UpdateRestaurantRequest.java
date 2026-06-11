package com.teamg5.be.dto;



import com.teamg5.be.entity.Place;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class UpdateRestaurantRequest {
  
    private String Name;
    private String address;
    private String description;
    private String phoneNumber;
    private Place place;
    private Long typeRestaurantId;
    private List<String> mediaUrls;


   
    
}
