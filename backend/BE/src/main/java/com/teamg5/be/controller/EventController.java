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
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Event Management", description = "APIs for Event and Promotion Management")
public class EventController {

    private final EventService eventService;

    @PostMapping("/restaurants/{restaurantId}/events")
    @Operation(summary = "Tạo chương trình khuyến mãi/sự kiện cho nhà hàng")
    public ResponseEntity<ApiResponse<EventResponse>> createEvent(
            @PathVariable Long restaurantId,
            @Valid @RequestBody CreateEventRequest request
    ) {
        EventResponse response = eventService.createEvent(restaurantId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<EventResponse>builder()
                .success(true)
                .message("Event created successfully")
                .data(response)
                .build());
    }

    @GetMapping("/restaurants/{restaurantId}/events")
    @Operation(summary = "Lấy danh sách khuyến mãi/sự kiện của nhà hàng")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getEventsByRestaurant(
            @PathVariable Long restaurantId
    ) {
        List<EventResponse> response = eventService.getEventsByRestaurant(restaurantId);
        return ResponseEntity.ok(ApiResponse.<List<EventResponse>>builder()
                .success(true)
                .message("Get restaurant events successfully")
                .data(response)
                .build());
    }

    @GetMapping("/events/{eventId}")
    @Operation(summary = "Lấy chi tiết sự kiện/khuyến mãi theo ID")
    public ResponseEntity<ApiResponse<EventResponse>> getEventById(
            @PathVariable Long eventId
    ) {
        EventResponse response = eventService.getEventById(eventId);
        return ResponseEntity.ok(ApiResponse.<EventResponse>builder()
                .success(true)
                .message("Get event detail successfully")
                .data(response)
                .build());
    }

    @PatchMapping("/events/{eventId}")
    @Operation(summary = "Cập nhật sự kiện/khuyến mãi")
    public ResponseEntity<ApiResponse<EventResponse>> updateEvent(
            @PathVariable Long eventId,
            @Valid @RequestBody UpdateEventRequest request
    ) {
        EventResponse response = eventService.updateEvent(eventId, request);
        return ResponseEntity.ok(ApiResponse.<EventResponse>builder()
                .success(true)
                .message("Event updated successfully")
                .data(response)
                .build());
    }

    @DeleteMapping("/events/{eventId}")
    @Operation(summary = "Xóa sự kiện/khuyến mãi")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(
            @PathVariable Long eventId
    ) {
        eventService.deleteEvent(eventId);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Event deleted successfully")
                .build());
    }

    @GetMapping("/events")
    @Operation(summary = "Lấy danh sách tất cả sự kiện/khuyến mãi đang hoạt động")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getAllActiveEvents() {
        List<EventResponse> response = eventService.getAllActiveEvents();
        return ResponseEntity.ok(ApiResponse.<List<EventResponse>>builder()
                .success(true)
                .message("Get all active events successfully")
                .data(response)
                .build());
    }
}
