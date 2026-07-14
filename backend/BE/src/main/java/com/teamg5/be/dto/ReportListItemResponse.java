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
public class ReportListItemResponse {
    private Long id;
    private String type;
    private String status;
    private String reason;
    private LocalDateTime createdAt;
    private ReportReporterDTO reporter;
    private ReportTargetDTO target;
}
