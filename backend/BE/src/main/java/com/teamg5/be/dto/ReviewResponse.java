package com.teamg5.be.dto;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import com.teamg5.be.entity.Review;
import com.teamg5.be.dto.MediaResponse;
@Getter
@Setter
@Builder
public class ReviewResponse {
    private long id;

    private Long userId;

    private Long restaurantId;
    private String restaurantName;

    private Long typeRestaurantId;
    private String typeRestaurantName;

    private List<MediaResponse> restaurantMedia;

    private Integer rating;
    private String context;

    public static ReviewResponse from(Review review) {
             return ReviewResponse.builder()
                .id(review.getId())
                .userId(review.getUser().getId())
                .restaurantId(review.getRestaurant().getId())
                .restaurantName(review.getRestaurant().getName())
                .typeRestaurantId(review.getRestaurant().getTypeRestaurant().getId())
                .typeRestaurantName(review.getRestaurant().getTypeRestaurant().getName())
                .restaurantMedia(
                        review.getRestaurant()
                                .getMediaList()
                                .stream()
                                .map(MediaResponse::from)
                                .toList()
                )
                .rating(review.getRating())
                .context(review.getContext())
                .build();
    }

    


}
