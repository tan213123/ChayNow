package com.teamg5.be.dto;

import com.teamg5.be.entity.EventType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UpdateEventRequest {
    private String title;
    private String description;
    private String imageUrl;
    private EventType eventType;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
}
