package com.teamg5.be.service;

import com.teamg5.be.dto.PageResponseDTO;
import com.teamg5.be.dto.ReportDetailResponse;
import com.teamg5.be.dto.ReportListItemResponse;
import com.teamg5.be.dto.ReportStatsResponse;

public interface AdminReportService {
    PageResponseDTO<ReportListItemResponse> getAllReports(
            String status,
            String type,
            String keyword,
            int page,
            int size
    );

    ReportStatsResponse getStats();

    ReportDetailResponse getReportDetail(Long id);
}
