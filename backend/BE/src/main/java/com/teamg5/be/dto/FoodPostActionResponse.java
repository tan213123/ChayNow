package com.teamg5.be.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FoodPostActionResponse {
    private String id;
    private String status;
    private LocalDateTime approvedAt;
    private LocalDateTime rejectedAt;
    private String rejectedReason;
    private String message;
}
