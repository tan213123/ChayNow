package com.teamg5.be.controller;

import com.teamg5.be.dto.PageResponseDTO;
import com.teamg5.be.dto.ReportDetailResponse;
import com.teamg5.be.dto.ReportListItemResponse;
import com.teamg5.be.dto.ReportStatsResponse;
import com.teamg5.be.service.AdminReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/reports")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
@Tag(name = "Admin - Reports Management", description = "APIs dành cho Admin để quản lý báo cáo vi phạm")
public class AdminReportController {

    private final AdminReportService adminReportService;

    @GetMapping
    @Operation(
        summary = "Lấy danh sách báo cáo vi phạm (Phân trang, Tìm kiếm, Lọc)",
        description = "API dành cho Admin để xem danh sách báo cáo vi phạm. Hỗ trợ tìm kiếm theo lý do, tên người báo cáo; lọc theo trạng thái duyệt (PENDING, RESOLVED, REJECTED) và loại đối tượng (REVIEW, POST, COMMENT)."
    )
    public ResponseEntity<PageResponseDTO<ReportListItemResponse>> getAllReports(
            @Parameter(description = "Lọc theo trạng thái báo cáo (PENDING, RESOLVED, REJECTED)", example = "PENDING")
            @RequestParam(required = false) String status,

            @Parameter(description = "Lọc theo loại đối tượng bị báo cáo (REVIEW, POST, COMMENT)", example = "REVIEW")
            @RequestParam(required = false) String type,

            @Parameter(description = "Từ khóa tìm kiếm (lý do báo cáo, tên người báo cáo)", example = "spam")
            @RequestParam(required = false) String keyword,

            @Parameter(description = "Số trang cần lấy (bắt đầu từ 0)", example = "0")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Số lượng phần tử trên mỗi trang (tối đa 50)", example = "10")
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponseDTO<ReportListItemResponse> response = adminReportService.getAllReports(status, type, keyword, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    @Operation(
        summary = "Thống kê số lượng báo cáo",
        description = "Trả về tổng số báo cáo, số báo cáo đang chờ xử lý, số báo cáo đã xử lý và số báo cáo bị từ chối."
    )
    public ResponseEntity<ReportStatsResponse> getStats() {
        ReportStatsResponse stats = adminReportService.getStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "Xem chi tiết một báo cáo vi phạm",
        description = "Trả về thông tin chi tiết của một báo cáo bao gồm người báo cáo và nội dung bị báo cáo (Review, Post, Comment)."
    )
    public ResponseEntity<ReportDetailResponse> getReportDetail(
            @Parameter(description = "ID của báo cáo vi phạm", example = "1")
            @PathVariable Long id
    ) {
        ReportDetailResponse response = adminReportService.getReportDetail(id);
        return ResponseEntity.ok(response);
    }
}
