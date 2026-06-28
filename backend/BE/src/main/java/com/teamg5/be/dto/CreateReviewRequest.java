package com.teamg5.be.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateReviewRequest {
    
    @NotNull(message = "Số sao đánh giá không được để trống.")
    @Min(value = 1, message = "Đánh giá tối thiểu là 1 sao.")
    @Max(value = 5, message = "Đánh giá tối đa là 5 sao.")
    private Integer rating;

    @NotBlank(message = "Nội dung đánh giá không được để trống.")
    private String context      ;
}
