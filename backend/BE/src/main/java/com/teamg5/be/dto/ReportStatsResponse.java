package com.teamg5.be.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportStatsResponse {
    private long totalReports;
    private long pendingReports;
    private long resolvedReports;
    private long rejectedReports;
}
