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
            message = "Số điện thoại không hợp lệ. Phải bắt đầu bằng 0 hoặc +84, theo sau bởi các đầu số hợp lệ (3, 5, 7, 8, 9) và có 8 chữ số."
    )
    private String phoneNumber;
    private Long placeId;
    private Long typeRestaurantId;
    private LocalTime openTime;
    private LocalTime closedTime;
    private List<Long> mediaIds;


   
    
}
