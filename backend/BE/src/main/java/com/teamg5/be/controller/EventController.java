package com.teamg5.be.controller;

import com.teamg5.be.dto.ApiResponse;
import com.teamg5.be.dto.CreateEventRequest;
import com.teamg5.be.dto.EventResponse;
import com.teamg5.be.dto.UpdateEventRequest;
import com.teamg5.be.service.EventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Event Management", description = "APIs for Event and Promotion Management")
public class EventController {

    private final EventService eventService;

    @GetMapping("/events")
    @Operation(summary = "Lấy tất cả sự kiện")
    public ResponseEntity<List<EventResponse>> getAllEvents() {
        List<EventResponse> response = eventService.getAllEvents();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/restaurants/{restaurantId}/events")
    @Operation(summary = "Lấy danh sách sự kiện của 1 nhà hàng")
    public ResponseEntity<List<EventResponse>> getEventsByRestaurant(
            @PathVariable Long restaurantId
    ) {
        List<EventResponse> response = eventService.getEventsByRestaurant(restaurantId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/events/{eventId}")
    @Operation(summary = "Lấy thông tin chi tiết của 1 sự kiện")
    public ResponseEntity<EventResponse> getEventById(
            @PathVariable Long eventId
    ) {
        EventResponse response = eventService.getEventById(eventId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/restaurants/{restaurantId}/events")
    @Operation(summary = "Tạo sự kiện mới cho nhà hàng")
    public ResponseEntity<EventResponse> createEvent(
            @PathVariable Long restaurantId,
            @Valid @RequestBody CreateEventRequest request
    ) {
        EventResponse response = eventService.createEvent(restaurantId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/events/{eventId}")
    @Operation(summary = "Cập nhật thông tin sự kiện")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable Long eventId,
            @Valid @RequestBody UpdateEventRequest request
    ) {
        EventResponse response = eventService.updateEvent(eventId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/events/{eventId}")
    @Operation(summary = "Xóa sự kiện")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(
            @PathVariable Long eventId
    ) {
        eventService.deleteEvent(eventId);
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message("Delete event successfully!")
                .data(null)
                .build();
        return ResponseEntity.ok(response);
    }
}
