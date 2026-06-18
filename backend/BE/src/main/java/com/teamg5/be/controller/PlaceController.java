package com.teamg5.be.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.teamg5.be.dto.ApiResponse;
import com.teamg5.be.dto.PlaceRequest;
import com.teamg5.be.dto.PlaceResponse;
import com.teamg5.be.dto.UpdatePlaceRequest;
import com.teamg5.be.service.PlaceService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/places")
@RequiredArgsConstructor
public class PlaceController {
     private final PlaceService placeService;

    @PostMapping
    //@PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Tạo địa điểm mới")
    public ResponseEntity<PlaceResponse> createPlace(
            @Valid @RequestBody PlaceRequest request
    ) {
        PlaceResponse response = placeService.createPlace(request);

        return ResponseEntity.ok(response);
    }

     @GetMapping
    @Operation(summary = "Lấy danh sách địa điểm đang hoạt động")
    public ResponseEntity<List<PlaceResponse>> getAllPlaces() {
        List<PlaceResponse> response = placeService.getAllPlaces();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{placeId}")
    @Operation(summary = "Lấy thông tin địa điểm theo ID")
    public ResponseEntity<PlaceResponse> getPlaceById(
            @PathVariable Long placeId
    ) {
        PlaceResponse response = placeService.getPlaceById(placeId);

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{placeId}")
    //@PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Cập nhật thông tin địa điểm")
    public ResponseEntity<PlaceResponse> updatePlace(
            @PathVariable Long placeId,
            @Valid @RequestBody UpdatePlaceRequest request
    ) {
        PlaceResponse response =
                placeService.updatePlace(placeId, request);

        return ResponseEntity.ok(response);
    }
     @DeleteMapping("/{placeId}")
    // @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Xóa mềm địa điểm")
    public ResponseEntity<ApiResponse<Void>> softDeletePlace(
            @PathVariable Long placeId
    ) {
        placeService.softDeletePlace(placeId);
        ApiResponse<Void> response= ApiResponse.<Void>builder()
                    .success(true)
                    .message("delete successfull!")
                    .data(null)
                    .build();
        return ResponseEntity.ok(response);

    }
}
