package com.teamg5.be.dto;

import com.teamg5.be.entity.Event;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventResponse {
    private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private Long restaurantId;
    private String restaurantName;
    private Long creatorId;
    private String creatorName;

    public static EventResponse from(Event event) {
        if (event == null) return null;
        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .imageUrl(event.getImageUrl())
                .startDate(event.getStartDate())
                .endDate(event.getEndDate())
                .status(event.getStatus())
                .restaurantId(event.getRestaurant() != null ? event.getRestaurant().getId() : null)
                .restaurantName(event.getRestaurant() != null ? event.getRestaurant().getName() : null)
                .creatorId(event.getCreator() != null ? event.getCreator().getId() : null)
                .creatorName(event.getCreator() != null ? event.getCreator().getFullName() : null)
                .build();
    }
}
