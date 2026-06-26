package com.teamg5.be.controller;

import com.teamg5.be.dto.ApiResponse;
import com.teamg5.be.dto.CreatePlaceRequest;
import com.teamg5.be.dto.PageResponseDTO;
import com.teamg5.be.dto.PlaceResponse;
import com.teamg5.be.dto.PlaceRequest;
import com.teamg5.be.dto.UpdatePlaceRequest;
import com.teamg5.be.service.PlaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Place / Area Management", description = "APIs quản lý khu vực/địa điểm (Quận 1, Quận 3, vv.) cho cả Public và Admin")
public class PlaceController {

    private final PlaceService placeService;

    // ================= PUBLIC PLACES API =================

    @GetMapping("/api/places")
    @Operation(summary = "Lấy danh sách địa điểm đang hoạt động (Public)")
    public ResponseEntity<List<PlaceResponse>> getAllPlaces() {
        List<PlaceResponse> response = placeService.getAllPlaces();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/places/{placeId}")
    @Operation(summary = "Lấy thông tin địa điểm theo ID")
    public ResponseEntity<PlaceResponse> getPlaceById(@PathVariable Long placeId) {
        PlaceResponse response = placeService.getPlaceById(placeId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/api/places")
    @Operation(summary = "Tạo địa điểm mới (Public/User)")
    public ResponseEntity<PlaceResponse> createPlacePublic(@Valid @RequestBody PlaceRequest request) {
        PlaceResponse response = placeService.createPlace(request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/api/places/{placeId}")
    @Operation(summary = "Cập nhật thông tin địa điểm")
    public ResponseEntity<PlaceResponse> updatePlacePublic(
            @PathVariable Long placeId,
            @Valid @RequestBody UpdatePlaceRequest request
    ) {
        PlaceResponse response = placeService.updatePlace(placeId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/api/places/{placeId}")
    @Operation(summary = "Xóa mềm địa điểm")
    public ResponseEntity<ApiResponse<Void>> softDeletePlace(@PathVariable Long placeId) {
        placeService.softDeletePlace(placeId);
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message("delete successfull!")
                .data(null)
                .build();
        return ResponseEntity.ok(response);
    }

    // ================= ADMIN PLACES API =================

    @GetMapping("/api/admin/places")
    @Operation(
        summary = "Lấy danh sách tất cả khu vực (Phân trang, Tìm kiếm, Lọc trạng thái) cho Admin",
        description = "API dành cho Admin để quản lý danh sách các khu vực. Hỗ trợ tìm kiếm và lọc theo trạng thái hoạt động."
    )
    public ResponseEntity<ApiResponse<PageResponseDTO<PlaceResponse>>> getAllPlacesForAdmin(
            @Parameter(description = "Từ khóa tìm kiếm (tên, quận, thành phố, địa chỉ)", example = "Quận 1")
            @RequestParam(required = false) String keyword,

            @Parameter(description = "Lọc theo trạng thái hoạt động (true/false)", example = "true")
            @RequestParam(required = false) Boolean active,

            @Parameter(description = "Số trang cần lấy (bắt đầu từ 0)", example = "0")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Số lượng phần tử trên mỗi trang (tối đa 50)", example = "10")
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponseDTO<PlaceResponse> response = placeService.getAllPlacesForAdmin(keyword, active, page, size);
        return ResponseEntity.ok(ApiResponse.<PageResponseDTO<PlaceResponse>>builder()
                .success(true)
                .message("Get all places successfully")
                .data(response)
                .build());
    }

    @PostMapping("/api/admin/places")
    @Operation(summary = "Tạo khu vực mới cho Admin")
    public ResponseEntity<ApiResponse<PlaceResponse>> createPlace(
            @Valid @RequestBody CreatePlaceRequest request
    ) {
        PlaceResponse response = placeService.createPlace(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<PlaceResponse>builder()
                .success(true)
                .message("Place created successfully")
                .data(response)
                .build());
    }

    @PutMapping("/api/admin/places/{id}")
    @Operation(summary = "Cập nhật thông tin khu vực cho Admin")
    public ResponseEntity<ApiResponse<PlaceResponse>> updatePlace(
            @PathVariable Long id,
            @Valid @RequestBody CreatePlaceRequest request
    ) {
        PlaceResponse response = placeService.updatePlace(id, request);
        return ResponseEntity.ok(ApiResponse.<PlaceResponse>builder()
                .success(true)
                .message("Place updated successfully")
                .data(response)
                .build());
    }

    @PatchMapping("/api/admin/places/{id}/toggle-active")
    @Operation(summary = "Kích hoạt hoặc Vô hiệu hóa khu vực cho Admin")
    public ResponseEntity<ApiResponse<PlaceResponse>> togglePlaceActive(@PathVariable Long id) {
        PlaceResponse response = placeService.togglePlaceActive(id);
        return ResponseEntity.ok(ApiResponse.<PlaceResponse>builder()
                .success(true)
                .message("Place status toggled successfully")
                .data(response)
                .build());
    }

    @DeleteMapping("/api/admin/places/{id}")
    @Operation(summary = "Xóa khu vực cho Admin")
    public ResponseEntity<ApiResponse<Void>> deletePlace(@PathVariable Long id) {
        placeService.deletePlace(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Place deleted successfully")
                .build());
    }
}
