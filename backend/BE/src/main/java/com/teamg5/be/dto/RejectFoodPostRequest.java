package com.teamg5.be.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RejectFoodPostRequest {
    @NotBlank(message = "Lý do không được để trống")
    @Size(min = 5, max = 500, message = "Lý do phải từ 5 đến 500 ký tự")
    private String reason;
}
