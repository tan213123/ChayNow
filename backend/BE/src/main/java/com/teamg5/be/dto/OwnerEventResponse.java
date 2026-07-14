package com.teamg5.be.dto;

import com.teamg5.be.entity.Event;
import com.teamg5.be.utils.EventStatusUtils;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OwnerEventResponse {
    private Long id;
    private Long restaurantId;
    private String type;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer discountPercent;
    private String period;
    private String charityTime;
    private String imageUrl;
    private String status;
    private LocalDateTime createdAt;

    public static OwnerEventResponse from(Event event) {
        if (event == null) return null;
        return OwnerEventResponse.builder()
                .id(event.getId())
                .restaurantId(event.getRestaurant() != null ? event.getRestaurant().getId() : null)
                .type(event.getType())
                .title(event.getTitle())
                .description(event.getDescription())
                .startDate(event.getStartDate())
                .endDate(event.getEndDate())
                .discountPercent(event.getDiscountPercent())
                .period(event.getPeriod())
                .charityTime(event.getCharityTime())
                .imageUrl(event.getImageUrl())
                .status(EventStatusUtils.resolve(event.getStatus(), event.getStartDate(), event.getEndDate()))
                .createdAt(event.getCreatedAt())
                .build();
    }
}
