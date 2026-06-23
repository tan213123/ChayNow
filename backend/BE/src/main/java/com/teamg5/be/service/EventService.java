package com.teamg5.be.service;

import com.teamg5.be.dto.CreateEventRequest;
import com.teamg5.be.dto.EventResponse;
import com.teamg5.be.dto.UpdateEventRequest;
import com.teamg5.be.entity.Event;
import com.teamg5.be.entity.Restaurant;
import com.teamg5.be.entity.User;
import com.teamg5.be.exception.AppException;
import com.teamg5.be.exception.ErrorCode;
import com.teamg5.be.repository.EventRepository;
import com.teamg5.be.repository.RestaurantRepository;
import com.teamg5.be.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class EventService {

    private final EventRepository eventRepository;
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll()
                .stream()
                .map(EventResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getEventsByRestaurant(Long restaurantId) {
        if (!restaurantRepository.existsById(restaurantId)) {
            throw new AppException(ErrorCode.RESTAURANT_NOT_FOUND);
        }
        return eventRepository.findAllByRestaurantIdOrderByCreatedAtDesc(restaurantId)
                .stream()
                .map(EventResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public EventResponse getEventById(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new AppException(ErrorCode.EVENT_NOT_FOUND));
        return EventResponse.from(event);
    }

    public EventResponse createEvent(Long restaurantId, CreateEventRequest request) {
        User currentUser = getCurrentUser();
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new AppException(ErrorCode.RESTAURANT_NOT_FOUND));

        // Check ownership: current user must be owner or ADMIN
        if (!restaurant.getOwner().getId().equals(currentUser.getId()) && !isAdmin(currentUser)) {
            throw new AppException(ErrorCode.EVENT_FORBIDDEN);
        }

        // Determine status automatically if not explicitly provided
        String status = request.getStatus();
        if (status == null || status.trim().isEmpty() || "AUTO".equalsIgnoreCase(status)) {
            status = determineStatus(request.getStartDate(), request.getEndDate());
        }

        Event event = Event.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .eventType(request.getEventType())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status(status)
                .restaurant(restaurant)
                .creator(currentUser)
                .build();

        Event savedEvent = eventRepository.save(event);
        return EventResponse.from(savedEvent);
    }

    public EventResponse updateEvent(Long eventId, UpdateEventRequest request) {
        User currentUser = getCurrentUser();
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new AppException(ErrorCode.EVENT_NOT_FOUND));

        // Check ownership: current user must be owner or ADMIN
        if (!event.getRestaurant().getOwner().getId().equals(currentUser.getId()) && !isAdmin(currentUser)) {
            throw new AppException(ErrorCode.EVENT_FORBIDDEN);
        }

        if (StringUtils.hasText(request.getTitle())) {
            event.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            event.setDescription(request.getDescription());
        }
        if (request.getImageUrl() != null) {
            event.setImageUrl(request.getImageUrl());
        }
        if (request.getEventType() != null) {
            event.setEventType(request.getEventType());
        }
        if (request.getStartDate() != null) {
            event.setStartDate(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            event.setEndDate(request.getEndDate());
        }

        // Update status
        String status = request.getStatus();
        if (status != null) {
            if ("AUTO".equalsIgnoreCase(status)) {
                event.setStatus(determineStatus(event.getStartDate(), event.getEndDate()));
            } else {
                event.setStatus(status);
            }
        } else if (request.getStartDate() != null || request.getEndDate() != null) {
            event.setStatus(determineStatus(event.getStartDate(), event.getEndDate()));
        }

        Event savedEvent = eventRepository.save(event);
        return EventResponse.from(savedEvent);
    }

    public void deleteEvent(Long eventId) {
        User currentUser = getCurrentUser();
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new AppException(ErrorCode.EVENT_NOT_FOUND));

        // Check ownership
        if (!event.getRestaurant().getOwner().getId().equals(currentUser.getId()) && !isAdmin(currentUser)) {
            throw new AppException(ErrorCode.EVENT_FORBIDDEN);
        }

        eventRepository.delete(event);
    }

    private String determineStatus(LocalDate startDate, LocalDate endDate) {
        LocalDate today = LocalDate.now();
        if (endDate.isBefore(today)) {
            return "EXPIRED";
        } else if (startDate.isAfter(today)) {
            return "UPCOMING";
        } else {
            return "ACTIVE";
        }
    }

    private boolean isAdmin(User user) {
        return user.getRole() != null && "ADMIN".equalsIgnoreCase(user.getRole().name());
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
