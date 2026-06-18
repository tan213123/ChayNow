package com.teamg5.be.service.impl;

import com.teamg5.be.dto.CreateEventRequest;
import com.teamg5.be.dto.OwnerEventResponse;
import com.teamg5.be.entity.Event;
import com.teamg5.be.entity.EventType;
import com.teamg5.be.entity.Restaurant;
import com.teamg5.be.entity.RestaurantStatus;
import com.teamg5.be.entity.Role;
import com.teamg5.be.entity.User;
import com.teamg5.be.exception.AppException;
import com.teamg5.be.exception.ErrorCode;
import com.teamg5.be.repository.EventRepository;
import com.teamg5.be.repository.RestaurantRepository;
import com.teamg5.be.repository.UserRepository;
import com.teamg5.be.service.OwnerEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Transactional
public class OwnerEventServiceImpl implements OwnerEventService {

    private final EventRepository eventRepository;
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;

    @Override
    public OwnerEventResponse createOwnerEvent(CreateEventRequest request) {
        User currentUser = getCurrentUser();

        // 1. Verify role is OWNER
        if (currentUser.getRole() != Role.OWNER) {
            throw new AppException(ErrorCode.FORBIDDEN, "Only users with role OWNER can create events");
        }

        if (request.getRestaurantId() == null) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Restaurant ID is required");
        }
        if (request.getType() == null || request.getType().isBlank()) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Event type is required (DISCOUNT or CHARITY)");
        }

        // 2. Fetch and check restaurant exists
        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                .orElseThrow(() -> new AppException(ErrorCode.RESTAURANT_NOT_FOUND, "Restaurant not found with ID: " + request.getRestaurantId()));

        // 3. Verify ownership
        if (restaurant.getOwner() == null || !restaurant.getOwner().getId().equals(currentUser.getId())) {
            throw new AppException(ErrorCode.FORBIDDEN, "You do not own this restaurant");
        }

        // 4. Verify restaurant is active
        if (!Boolean.TRUE.equals(restaurant.getActive()) || restaurant.getStatus() == RestaurantStatus.REJECTED) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Restaurant is inactive or rejected");
        }

        // 5. Validate type
        String typeStr = request.getType().trim().toUpperCase();
        EventType eventType;
        try {
            eventType = EventType.valueOf(typeStr);
        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Invalid event type. Must be DISCOUNT or CHARITY");
        }

        // 6. Validate dates
        LocalDate today = LocalDate.now();
        if (request.getStartDate().isBefore(today)) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Start date cannot be in the past");
        }
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new AppException(ErrorCode.INVALID_INPUT, "End date must be greater than or equal to start date");
        }

        // 7. Validate discountPercent & periods
        Integer discountPercent = null;
        String period = null;
        String charityTime = null;
        if (eventType == EventType.DISCOUNT) {
            discountPercent = request.getDiscountPercent();
            if (discountPercent == null || discountPercent < 1 || discountPercent > 100) {
                throw new AppException(ErrorCode.INVALID_INPUT, "Discount percent must be between 1 and 100 for DISCOUNT events");
            }
        } else {
            period = request.getPeriod() != null ? request.getPeriod().trim() : null;
            charityTime = request.getCharityTime() != null ? request.getCharityTime().trim() : null;
        }

        // 8. Create event
        String imgUrl = request.getImageUrl() != null && !request.getImageUrl().isBlank() ? request.getImageUrl().trim() : null;

        Event event = Event.builder()
                .restaurant(restaurant)
                .creator(currentUser)
                .title(request.getTitle().trim())
                .description(request.getDescription().trim())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .type(eventType.name())
                .discountPercent(discountPercent)
                .period(period)
                .charityTime(charityTime)
                .imageUrl(imgUrl)
                .status("ACTIVE")
                .build();

        Event saved = eventRepository.save(event);
        return OwnerEventResponse.from(saved);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof User user) {
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
