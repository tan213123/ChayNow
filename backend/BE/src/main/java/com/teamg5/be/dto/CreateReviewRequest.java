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
    
@NotNull(message = "The star rating cannot be left blank.")
    @Min(value = 1, message = "The minimum star rating is 1.")
    @Max(value = 5, message = "The maximum number of stars is 5.")
    private Integer rating;

    @NotBlank(message = "The evaluation section must not be left blank.")
    private String context      ;
}
