package com.teamg5.be.service;

import com.teamg5.be.dto.CreateEventRequest;
import com.teamg5.be.dto.EventResponse;
import com.teamg5.be.dto.UpdateEventRequest;

import java.util.List;

public interface EventService {
    EventResponse createEvent(Long restaurantId, CreateEventRequest request);

    EventResponse updateEvent(Long eventId, UpdateEventRequest request);

    void deleteEvent(Long eventId);

    EventResponse getEventById(Long eventId);

    List<EventResponse> getEventsByRestaurant(Long restaurantId);

    List<EventResponse> getAllActiveEvents();
}
