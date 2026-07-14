package com.teamg5.be.dto;

import com.teamg5.be.entity.ReviewTestOptionClick;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewTestOptionClickUserResponse {
    private Long userId;
    private String fullName;
    private String email;
    private LocalDateTime clickedAt;

    public static ReviewTestOptionClickUserResponse from(ReviewTestOptionClick click) {
        return ReviewTestOptionClickUserResponse.builder()
                .userId(click.getUser().getId())
                .fullName(click.getUser().getFullName())
                .email(click.getUser().getEmail())
                .clickedAt(click.getCreatedAt())
                .build();
    }
}
