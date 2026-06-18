package com.teamg5.be.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateMenuRequest {
    @NotBlank(message = "Name of food cannot null")
    @Size(max = 255, message = "Name of food cannot over 255 word!")
    private String name;

    @Size(max = 500, message = "Description cannot over 500 word!")
    private String description;

    @NotNull(message = "Price of food cannot null")
    @Min(value = 0, message = "Price of food cannot under 0đ")
    private Integer price;

    @Size(max = 100, message = "category cannot over 100 word!")
    private String category;

    @Size(max = 1000, message = "URL cannot over 1000 Word!")
    private String imageUrl;

    private Boolean available;

    private Boolean featured;
}
