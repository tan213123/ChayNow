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
    @NotBlank(message = "Reason is required")
    @Size(min = 5, max = 500, message = "Reason length must be between 5 and 500 characters")
    private String reason;
}
