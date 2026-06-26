package com.teamg5.be.dto;

import com.teamg5.be.entity.EventType;
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
public class UpdateEventRequest {
    private String title;
    private String description;
    private String imageUrl;
    private String type;
    private EventType eventType;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
}
