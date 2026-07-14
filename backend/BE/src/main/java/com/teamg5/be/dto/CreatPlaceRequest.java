package com.teamg5.be.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
@Setter
@Getter
@Builder

    public class CreatPlaceRequest {
        @NotBlank(message = "Tên địa điểm không được để trống")
        private String name;

        private String district;

        private String city;

        private String address;

        private Double latitude;

        private Double longitude;

        private String mapUrl;
}
