package com.teamg5.be.controller;

import com.teamg5.be.dto.*;
import com.teamg5.be.security.JwtAccessDeniedHandler;
import com.teamg5.be.security.JwtAuthenticationEntryPoint;
import com.teamg5.be.security.JwtService;
import com.teamg5.be.service.AdminReportService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.cors.CorsConfigurationSource;

import java.time.LocalDateTime;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminReportController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AdminReportControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AdminReportService adminReportService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @MockitoBean
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @MockitoBean
    private JwtAccessDeniedHandler jwtAccessDeniedHandler;

    @MockitoBean
    private CorsConfigurationSource corsConfigurationSource;

    @Test
    public void getAllReports_Success() throws Exception {
        ReportReporterDTO reporter = ReportReporterDTO.builder()
                .id(12L)
                .fullName("Nguyễn Văn An")
                .avatarUrl("https://avatar")
                .build();

        ReportTargetDTO target = ReportTargetDTO.builder()
                .id(55L)
                .type("REVIEW")
                .title("Đánh giá")
                .content("Quán rất ngon...")
                .build();

        ReportListItemResponse item = ReportListItemResponse.builder()
                .id(1L)
                .type("REVIEW")
                .status("PENDING")
                .reason("Nội dung không phù hợp, spam")
                .createdAt(LocalDateTime.of(2026, 5, 29, 7, 0))
                .reporter(reporter)
                .target(target)
                .build();

        PageResponseDTO<ReportListItemResponse> pageResponse = PageResponseDTO.<ReportListItemResponse>builder()
                .content(Collections.singletonList(item))
                .page(0)
                .size(10)
                .totalElements(1L)
                .totalPages(1)
                .last(true)
                .build();

        when(adminReportService.getAllReports(any(), any(), any(), anyInt(), anyInt()))
                .thenReturn(pageResponse);

        mockMvc.perform(get("/api/admin/reports")
                        .param("status", "PENDING")
                        .param("type", "REVIEW")
                        .param("page", "0")
                        .param("size", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.content[0].status").value("PENDING"))
                .andExpect(jsonPath("$.content[0].reporter.fullName").value("Nguyễn Văn An"))
                .andExpect(jsonPath("$.content[0].target.content").value("Quán rất ngon..."));
    }

    @Test
    public void getStats_Success() throws Exception {
        ReportStatsResponse stats = ReportStatsResponse.builder()
                .totalReports(150)
                .pendingReports(25)
                .resolvedReports(110)
                .rejectedReports(15)
                .build();

        when(adminReportService.getStats()).thenReturn(stats);

        mockMvc.perform(get("/api/admin/reports/stats")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalReports").value(150))
                .andExpect(jsonPath("$.pendingReports").value(25))
                .andExpect(jsonPath("$.resolvedReports").value(110))
                .andExpect(jsonPath("$.rejectedReports").value(15));
    }

    @Test
    public void getReportDetail_Success() throws Exception {
        ReportReporterDTO reporter = ReportReporterDTO.builder()
                .id(1L)
                .fullName("Nguyễn Văn An")
                .email("abc@gmail.com")
                .avatarUrl("")
                .build();

        ReportTargetDTO target = ReportTargetDTO.builder()
                .id(12L)
                .type("REVIEW")
                .title("Đánh giá")
                .content("Quán rất ngon")
                .ownerId(33L)
                .build();

        ReportDetailResponse detail = ReportDetailResponse.builder()
                .id(1L)
                .status("PENDING")
                .reason("Spam")
                .description("Người này spam rất nhiều")
                .createdAt(LocalDateTime.of(2026, 5, 29, 7, 0))
                .reporter(reporter)
                .target(target)
                .build();

        when(adminReportService.getReportDetail(1L)).thenReturn(detail);

        mockMvc.perform(get("/api/admin/reports/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.reason").value("Spam"))
                .andExpect(jsonPath("$.description").value("Người này spam rất nhiều"))
                .andExpect(jsonPath("$.reporter.email").value("abc@gmail.com"))
                .andExpect(jsonPath("$.target.ownerId").value(33));
    }
}
