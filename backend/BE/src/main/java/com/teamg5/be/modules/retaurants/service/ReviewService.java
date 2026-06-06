package com.teamg5.be.modules.retaurants.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.teamg5.be.modules.auth.repository.UserRepository;
import com.teamg5.be.modules.retaurants.dto.request.CreateReviewRequest;
import com.teamg5.be.modules.retaurants.dto.response.ReviewResponse;
import com.teamg5.be.modules.retaurants.entity.Restaurant;
import com.teamg5.be.modules.retaurants.entity.Review;
import com.teamg5.be.modules.retaurants.repository.RestaurantRepository;
import com.teamg5.be.modules.retaurants.repository.ReviewRepository;
import com.teamg5.be.shared.exception.AppException;
import com.teamg5.be.shared.exception.ErrorCode;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import com.teamg5.be.modules.auth.entity.User;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;


@Service
@RequiredArgsConstructor
@Transactional
public class ReviewService {
     private final ReviewRepository reviewRepository;
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;

    public ReviewResponse createReview(Long restaurantId, CreateReviewRequest request) {

        User currentUser = getCurrentUser();

        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new AppException(ErrorCode.RESTAURANT_NOT_FOUND));

        boolean alreadyReviewed = reviewRepository.existsByUser_IdAndRestaurant_Id(
                currentUser.getId(),
                restaurantId
        );

        if (alreadyReviewed) {
            throw new AppException(ErrorCode.REVIEW_ALREADY_EXISTS);
        }

        Review review = Review.builder()
                .user(currentUser)
                .restaurant(restaurant)
                .rating(request.getRating())
                .context(request.getContext())
                .build();

        Review savedReview = reviewRepository.save(review);

        return ReviewResponse.from(savedReview);
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByRestaurant(Long restaurantId) {

        boolean restaurantExists = restaurantRepository.existsById(restaurantId);

        if (!restaurantExists) {
            throw new AppException(ErrorCode.RESTAURANT_NOT_FOUND);
        }

        return reviewRepository.findByRestaurant_Id(restaurantId)
                .stream()
                .map(ReviewResponse::from)
                .toList();
    }

    private User getCurrentUser() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof User user) {
            System.out.println(user);
            return user;
        }

        String email = authentication.getName();

        if (email == null || email.equals("anonymousUser")) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }
}
