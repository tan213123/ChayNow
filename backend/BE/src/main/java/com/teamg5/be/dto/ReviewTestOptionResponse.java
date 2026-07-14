package com.teamg5.be.dto;

import com.teamg5.be.entity.ReviewTestOption;
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
public class ReviewTestOptionResponse {
    private Long id;
    private String label;
    private Integer displayOrder;
    private Long clickCount;
    private Boolean clickedByCurrentUser;

    public static ReviewTestOptionResponse from(ReviewTestOption option, long clickCount, boolean clickedByCurrentUser) {
        return ReviewTestOptionResponse.builder()
                .id(option.getId())
                .label(option.getLabel())
                .displayOrder(option.getDisplayOrder())
                .clickCount(clickCount)
                .clickedByCurrentUser(clickedByCurrentUser)
                .build();
    }
}
