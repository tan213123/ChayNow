package com.teamg5.be.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportActionResponse {
    private Long reportId;
    private String status; // RESOLVED or REJECTED
    private String message;
    private LocalDateTime resolvedAt;
}
