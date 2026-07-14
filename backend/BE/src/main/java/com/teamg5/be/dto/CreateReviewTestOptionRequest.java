package com.teamg5.be.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateReviewTestOptionRequest {

    @NotBlank(message = "Nội dung lựa chọn không được để trống.")
    @Size(max = 150, message = "Nội dung lựa chọn tối đa 150 ký tự.")
    private String label;

    private Integer displayOrder;
}
