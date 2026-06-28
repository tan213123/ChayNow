package com.teamg5.be.controller;

import com.teamg5.be.dto.ApiResponse;
import com.teamg5.be.dto.CreateEventRequest;
import com.teamg5.be.dto.OwnerEventResponse;
import com.teamg5.be.service.OwnerEventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/owner")
@RequiredArgsConstructor
@Tag(name = "Owner Events", description = "APIs dành cho Owner để quản lý sự kiện và khuyến mãi của nhà hàng")
public class OwnerEventController {

    private final OwnerEventService ownerEventService;

    @PostMapping("/events")
    @PreAuthorize("hasRole('OWNER')")
    @Operation(summary = "Tạo sự kiện hoặc chương trình khuyến mãi mới (Owner)")
    public ResponseEntity<ApiResponse<OwnerEventResponse>> createOwnerEvent(
            @Valid @RequestBody CreateEventRequest request
    ) {
        OwnerEventResponse response = ownerEventService.createOwnerEvent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<OwnerEventResponse>builder()
                .success(true)
                .message("Event created successfully")
                .data(response)
                .build());
    }
}
