package com.teamg5.be.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportReporterDTO {
    private Long id;
    private String fullName;
    private String email;
    private String avatarUrl;
}
