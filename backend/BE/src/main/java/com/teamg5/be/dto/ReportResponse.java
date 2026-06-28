package com.teamg5.be.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponse {
    private Long id;
    private String reporterEmail;
    private String targetType;
    private Long targetId;
    private String reason;
    private String details;
    private String status;
    private LocalDateTime createdAt;
}
