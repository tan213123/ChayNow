package com.teamg5.be.service;

import com.teamg5.be.dto.CreateReviewRequest;
import com.teamg5.be.dto.ReviewResponse;
import com.teamg5.be.entity.Restaurant;
import com.teamg5.be.entity.Review;
import com.teamg5.be.entity.TypeRestaurant;
import com.teamg5.be.entity.User;
import com.teamg5.be.exception.AppException;
import com.teamg5.be.exception.ErrorCode;
import com.teamg5.be.repository.RestaurantRepository;
import com.teamg5.be.repository.ReviewRepository;
import com.teamg5.be.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class ReviewServiceTest {

    @InjectMocks
    private ReviewService reviewService;

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private RestaurantRepository restaurantRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    private User currentUser;
    private TypeRestaurant mockType;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        SecurityContextHolder.setContext(securityContext);
        
        currentUser = User.builder()
                .email("test@example.com")
                .fullName("Test User")
                .build();
        currentUser.setId(1L);

        mockType = TypeRestaurant.builder()
                .name("Vegan")
                .description("Vegan food")
                .build();
        mockType.setId(5L);
    }

    @AfterEach
    public void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    public void createReview_Success_PrincipalIsUser() {
        // Arrange
        CreateReviewRequest request = new CreateReviewRequest();
        request.setRating(5);
        request.setContext("Amazing place!");

        Restaurant restaurant = Restaurant.builder()
                .name("Good Food")
                .typeRestaurant(mockType)
                .build();
        restaurant.setId(10L);

        Review savedReview = Review.builder()
                .user(currentUser)
                .restaurant(restaurant)
                .rating(5)
                .context("Amazing place!")
                .build();
        savedReview.setId(100L);

        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(currentUser);

        when(restaurantRepository.findById(10L)).thenReturn(Optional.of(restaurant));
        when(reviewRepository.existsByUser_IdAndRestaurant_Id(1L, 10L)).thenReturn(false);
        when(reviewRepository.save(any(Review.class))).thenReturn(savedReview);

        // Act
        ReviewResponse response = reviewService.createReview(10L, request);

        // Assert
        assertNotNull(response);
        assertEquals(100L, response.getId());
        assertEquals("Amazing place!", response.getContext());
        assertEquals(5, response.getRating());
        verify(reviewRepository, times(1)).save(any(Review.class));
    }

    @Test
    public void createReview_Success_PrincipalIsEmail() {
        // Arrange
        CreateReviewRequest request = new CreateReviewRequest();
        request.setRating(5);
        request.setContext("Amazing place!");

        Restaurant restaurant = Restaurant.builder()
                .name("Good Food")
                .typeRestaurant(mockType)
                .build();
        restaurant.setId(10L);

        Review savedReview = Review.builder()
                .user(currentUser)
                .restaurant(restaurant)
                .rating(5)
                .context("Amazing place!")
                .build();
        savedReview.setId(100L);

        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn("test@example.com");
        when(authentication.getName()).thenReturn("test@example.com");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(currentUser));
        when(restaurantRepository.findById(10L)).thenReturn(Optional.of(restaurant));
        when(reviewRepository.existsByUser_IdAndRestaurant_Id(1L, 10L)).thenReturn(false);
        when(reviewRepository.save(any(Review.class))).thenReturn(savedReview);

        // Act
        ReviewResponse response = reviewService.createReview(10L, request);

        // Assert
        assertNotNull(response);
        assertEquals(100L, response.getId());
        verify(userRepository, times(1)).findByEmail("test@example.com");
    }

    @Test
    public void createReview_NotAuthenticated_ThrowsException() {
        // Arrange
        CreateReviewRequest request = new CreateReviewRequest();
        when(securityContext.getAuthentication()).thenReturn(null);

        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> reviewService.createReview(10L, request));
        assertEquals(ErrorCode.UNAUTHORIZED, exception.getErrorCode());
    }

    @Test
    public void createReview_RestaurantNotFound_ThrowsException() {
        // Arrange
        CreateReviewRequest request = new CreateReviewRequest();
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(currentUser);

        when(restaurantRepository.findById(10L)).thenReturn(Optional.empty());

        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> reviewService.createReview(10L, request));
        assertEquals(ErrorCode.RESTAURANT_NOT_FOUND, exception.getErrorCode());
    }

    @Test
    public void createReview_AlreadyReviewed_ThrowsException() {
        // Arrange
        CreateReviewRequest request = new CreateReviewRequest();
        Restaurant restaurant = Restaurant.builder()
                .name("Good Food")
                .typeRestaurant(mockType)
                .build();
        restaurant.setId(10L);

        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(currentUser);

        when(restaurantRepository.findById(10L)).thenReturn(Optional.of(restaurant));
        when(reviewRepository.existsByUser_IdAndRestaurant_Id(1L, 10L)).thenReturn(true);

        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> reviewService.createReview(10L, request));
        assertEquals(ErrorCode.REVIEW_ALREADY_EXISTS, exception.getErrorCode());
    }

    @Test
    public void getReviewsByRestaurant_Success() {
        // Arrange
        Restaurant restaurant = Restaurant.builder()
                .name("Good Food")
                .typeRestaurant(mockType)
                .build();
        restaurant.setId(10L);

        Review review = Review.builder()
                .user(currentUser)
                .restaurant(restaurant)
                .rating(4)
                .context("Good")
                .build();
        review.setId(100L);

        when(restaurantRepository.existsById(10L)).thenReturn(true);
        when(reviewRepository.findByRestaurant_Id(10L)).thenReturn(Collections.singletonList(review));

        // Act
        List<ReviewResponse> responses = reviewService.getReviewsByRestaurant(10L);

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals("Good", responses.get(0).getContext());
    }

    @Test
    public void getReviewsByRestaurant_NotFound_ThrowsException() {
        // Arrange
        when(restaurantRepository.existsById(10L)).thenReturn(false);

        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> reviewService.getReviewsByRestaurant(10L));
        assertEquals(ErrorCode.RESTAURANT_NOT_FOUND, exception.getErrorCode());
    }
}
