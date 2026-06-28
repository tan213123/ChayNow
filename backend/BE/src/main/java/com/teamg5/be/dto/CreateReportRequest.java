package com.teamg5.be.dto;

import com.teamg5.be.entity.ReportTargetType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateReportRequest {

    @NotNull(message = "Loại đối tượng bị báo cáo không được để trống")
    private ReportTargetType targetType;

    @NotNull(message = "Mã đối tượng bị báo cáo không được để trống")
    private Long targetId;

    @NotBlank(message = "Lý do báo cáo không được để trống")
    @Size(max = 255, message = "Lý do báo cáo không được vượt quá 255 ký tự")
    private String reason;

    @Size(max = 1000, message = "Chi tiết báo cáo không được vượt quá 1000 ký tự")
    private String details;
}
