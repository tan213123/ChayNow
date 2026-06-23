package com.teamg5.be.dto;

import com.teamg5.be.entity.Event;
import com.teamg5.be.entity.EventType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class EventResponse {
    private Long id;
    private Long restaurantId;
    private String restaurantName;
    private Long creatorId;
    private String creatorName;
    private String title;
    private String description;
    private String imageUrl;
    private EventType eventType;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static EventResponse from(Event event) {
        if (event == null) return null;
        return EventResponse.builder()
                .id(event.getId())
                .restaurantId(event.getRestaurant() != null ? event.getRestaurant().getId() : null)
                .restaurantName(event.getRestaurant() != null ? event.getRestaurant().getName() : null)
                .creatorId(event.getCreator() != null ? event.getCreator().getId() : null)
                .creatorName(event.getCreator() != null ? event.getCreator().getFullName() : null)
                .title(event.getTitle())
                .description(event.getDescription())
                .imageUrl(event.getImageUrl())
                .eventType(event.getEventType())
                .startDate(event.getStartDate())
                .endDate(event.getEndDate())
                .status(event.getStatus())
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .build();
    }
}
