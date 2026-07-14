package com.teamg5.be.service.impl;

import com.teamg5.be.dto.CreateReviewRequest;
import com.teamg5.be.dto.ReviewResponse;
import com.teamg5.be.entity.Restaurant;
import com.teamg5.be.entity.Review;
import com.teamg5.be.entity.User;
import com.teamg5.be.exception.AppException;
import com.teamg5.be.exception.ErrorCode;
import com.teamg5.be.repository.RestaurantRepository;
import com.teamg5.be.repository.ReviewRepository;
import com.teamg5.be.repository.UserRepository;
import com.teamg5.be.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.teamg5.be.entity.NotificationType;
import com.teamg5.be.event.SystemNotificationEvent;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewServiceImpl implements ReviewService {
    
    private final ReviewRepository reviewRepository;
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    public ReviewResponse createReview(Long restaurantId, CreateReviewRequest request) {

        User currentUser = getCurrentUser();

        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new AppException(ErrorCode.RESTAURANT_NOT_FOUND));

        if (restaurant.getOwner() != null && restaurant.getOwner().getId().equals(currentUser.getId())) {
            throw new AppException(ErrorCode.OWNER_CANNOT_REVIEW);
        }

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

        try {
            if (restaurant.getOwner() != null && !restaurant.getOwner().getId().equals(currentUser.getId())) {
                eventPublisher.publishEvent(new SystemNotificationEvent(
                        restaurant.getOwner(),
                        "Đánh giá mới cho nhà hàng của bạn",
                        "Người dùng " + currentUser.getFullName() + " đã đánh giá " + review.getRating() + " sao cho nhà hàng '" + restaurant.getName() + "' của bạn",
                        NotificationType.NEW_REVIEW_COMMENT,
                        restaurant.getId().toString()
                ));
            }
        } catch (Exception e) {
            // Log warning but don't fail review transaction
        }

        return ReviewResponse.from(savedReview);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByRestaurant(Long restaurantId) {

        restaurantRepository.findByIdAndActiveTrue(restaurantId)
                .orElseThrow(() ->
                        new AppException(
                                ErrorCode.RESTAURANT_NOT_FOUND
                        )
                );

        return reviewRepository.findByRestaurant_Id(restaurantId)
                .stream()
                .map(ReviewResponse::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getAllReviews() {

        return reviewRepository.findAll()
                .stream()
                .map(ReviewResponse::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewResponse getReviewById(Long reviewId) {

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() ->
                        new AppException(ErrorCode.REVIEW_NOT_FOUND)
                );

        return ReviewResponse.from(review);
    }

    @Override
    public ReviewResponse updateReview(
            Long reviewId,
            CreateReviewRequest request
    ) {
        User currentUser = getCurrentUser();

        Review review = reviewRepository
                .findByIdAndUser_Id(
                        reviewId,
                        currentUser.getId()
                )
                .orElseThrow(() ->
                        new AppException(ErrorCode.REVIEW_NOT_FOUND)
                );

        review.setRating(request.getRating());
        review.setContext(request.getContext().trim());

        Review savedReview = reviewRepository.save(review);

        return ReviewResponse.from(savedReview);
    }

    @Override
    public void deleteReview(Long reviewId) {

        User currentUser = getCurrentUser();

        Review review = reviewRepository
                .findByIdAndUser_Id(
                        reviewId,
                        currentUser.getId()
                )
                .orElseThrow(() ->
                        new AppException(ErrorCode.REVIEW_NOT_FOUND)
                );

        reviewRepository.delete(review);
    }

    @Override
    public void adminDeleteReview(Long reviewId) {

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() ->
                        new AppException(ErrorCode.REVIEW_NOT_FOUND)
                );

        reviewRepository.delete(review);
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
