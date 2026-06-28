package com.teamg5.be.dto;

import com.teamg5.be.entity.EventType;
import jakarta.validation.constraints.Size;
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
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;

    @Size(max = 5000, message = "Description must not exceed 5000 characters")
    private String description;

    @Size(max = 500, message = "Image URL must not exceed 500 characters")
    private String imageUrl;

    @Size(max = 50, message = "Type must not exceed 50 characters")
    private String type;

    private EventType eventType;
    private LocalDate startDate;
    private LocalDate endDate;

    @Size(max = 50, message = "Status must not exceed 50 characters")
    private String status;
}
