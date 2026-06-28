package com.teamg5.be.service.impl;

import com.teamg5.be.dto.CreateEventRequest;
import com.teamg5.be.dto.EventResponse;
import com.teamg5.be.dto.UpdateEventRequest;
import com.teamg5.be.entity.Event;
import com.teamg5.be.entity.EventType;
import com.teamg5.be.entity.Restaurant;
import com.teamg5.be.entity.Role;
import com.teamg5.be.entity.User;
import com.teamg5.be.exception.AppException;
import com.teamg5.be.exception.ErrorCode;
import com.teamg5.be.repository.EventRepository;
import com.teamg5.be.repository.RestaurantRepository;
import com.teamg5.be.repository.UserRepository;
import com.teamg5.be.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll()
                .stream()
                .map(EventResponse::from)
                .toList();
    }

    @Override
    public EventResponse createEvent(Long restaurantId, CreateEventRequest request) {
        Restaurant restaurant = restaurantRepository.findByIdAndActiveTrue(restaurantId)
                .orElseThrow(() -> new AppException(ErrorCode.RESTAURANT_NOT_FOUND));

        verifyOwnerOrAdmin(restaurant);

        if (request.getStartDate() != null && request.getEndDate() != null) {
            if (request.getEndDate().isBefore(request.getStartDate())) {
                throw new AppException(ErrorCode.INVALID_INPUT, "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu");
            }
        }

        EventType eventType = request.getEventType();
        if (eventType == null && request.getType() != null) {
            try {
                eventType = EventType.valueOf(request.getType().trim().toUpperCase());
            } catch (IllegalArgumentException ignored) {
                eventType = null;
            }
        }

        Event event = Event.builder()
                .restaurant(restaurant)
                .creator(getCurrentUser())
                .title(request.getTitle().trim())
                .description(request.getDescription() != null ? request.getDescription().trim() : null)
                .imageUrl(request.getImageUrl() != null ? request.getImageUrl().trim() : null)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .type(eventType != null ? eventType.name() : request.getType())
                .eventType(eventType)
                .status(request.getStatus() != null ? request.getStatus().trim() : "UPCOMING")
                .build();

        Event saved = eventRepository.save(event);
        return EventResponse.from(saved);
    }

    @Override
    public EventResponse updateEvent(Long eventId, UpdateEventRequest request) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Event not found"));

        verifyOwnerOrAdmin(event.getRestaurant());

        java.time.LocalDate startDate = request.getStartDate() != null ? request.getStartDate() : event.getStartDate();
        java.time.LocalDate endDate = request.getEndDate() != null ? request.getEndDate() : event.getEndDate();
        if (startDate != null && endDate != null && endDate.isBefore(startDate)) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu");
        }

        if (StringUtils.hasText(request.getTitle())) {
            event.setTitle(request.getTitle().trim());
        }
        if (request.getDescription() != null) {
            event.setDescription(request.getDescription().trim());
        }
        if (request.getImageUrl() != null) {
            event.setImageUrl(request.getImageUrl().trim());
        }
        if (request.getEventType() != null) {
            event.setEventType(request.getEventType());
            event.setType(request.getEventType().name());
        } else if (request.getType() != null) {
            try {
                EventType eventType = EventType.valueOf(request.getType().trim().toUpperCase());
                event.setEventType(eventType);
                event.setType(eventType.name());
            } catch (IllegalArgumentException ignored) {
                event.setType(request.getType());
            }
        }
        if (request.getStartDate() != null) {
            event.setStartDate(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            event.setEndDate(request.getEndDate());
        }
        if (StringUtils.hasText(request.getStatus())) {
            event.setStatus(request.getStatus().trim());
        }

        Event saved = eventRepository.save(event);
        return EventResponse.from(saved);
    }

    @Override
    public void deleteEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Event not found"));

        verifyOwnerOrAdmin(event.getRestaurant());

        eventRepository.delete(event);
    }

    @Override
    @Transactional(readOnly = true)
    public EventResponse getEventById(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Event not found"));
        return EventResponse.from(event);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventResponse> getEventsByRestaurant(Long restaurantId) {
        restaurantRepository.findByIdAndActiveTrue(restaurantId)
                .orElseThrow(() -> new AppException(ErrorCode.RESTAURANT_NOT_FOUND));

        return eventRepository.findByRestaurantId(restaurantId).stream()
                .map(EventResponse::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventResponse> getAllActiveEvents() {
        return eventRepository.findByStatusNot("HIDDEN").stream()
                .map(EventResponse::from)
                .toList();
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

    private void verifyOwnerOrAdmin(Restaurant restaurant) {
        User currentUser = getCurrentUser();
        if (currentUser.getRole() != Role.ADMIN) {
            if (restaurant.getOwner() == null || !restaurant.getOwner().getId().equals(currentUser.getId())) {
                throw new AppException(ErrorCode.FORBIDDEN);
            }
        }
    }
}
