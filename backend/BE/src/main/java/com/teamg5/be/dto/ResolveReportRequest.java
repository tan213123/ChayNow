package com.teamg5.be.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResolveReportRequest {
    @NotBlank(message = "Action is required (ACCEPT or REJECT)")
    private String action; // ACCEPT or REJECT

    private String details; // Reason/Details of resolution
}
