package com.teamg5.be.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.teamg5.be.dto.CreateReportRequest;
import com.teamg5.be.dto.ReportResponse;
import com.teamg5.be.entity.ReportTargetType;
import com.teamg5.be.security.JwtAccessDeniedHandler;
import com.teamg5.be.security.JwtAuthenticationEntryPoint;
import com.teamg5.be.security.JwtService;
import com.teamg5.be.service.ReportService;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ReportController.class)
@AutoConfigureMockMvc(addFilters = false)
public class ReportControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ReportService reportService;

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

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    public void createReport_Success() throws Exception {
        // Arrange
        CreateReportRequest request = CreateReportRequest.builder()
                .targetType(ReportTargetType.RESTAURANT)
                .targetId(5L)
                .reason("Spam location")
                .details("Details about spam")
                .build();

        ReportResponse response = ReportResponse.builder()
                .id(100L)
                .reporterEmail("reporter@example.com")
                .targetType("RESTAURANT")
                .targetId(5L)
                .reason("Spam location")
                .details("Details about spam")
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .build();

        when(reportService.createReport(any(CreateReportRequest.class))).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post("/api/reports")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Báo cáo vi phạm đã được gửi thành công."))
                .andExpect(jsonPath("$.data.id").value(100L))
                .andExpect(jsonPath("$.data.reporterEmail").value("reporter@example.com"))
                .andExpect(jsonPath("$.data.status").value("PENDING"));
    }
}
