package com.teamg5.be.service;

import com.teamg5.be.dto.CreateReportRequest;
import com.teamg5.be.dto.ReportResponse;

public interface ReportService {
    ReportResponse createReport(CreateReportRequest request);
}
