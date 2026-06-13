package com.teamg5.be.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


import com.teamg5.be.dto.ApiResponse;
import com.teamg5.be.dto.CreateRestaurantRequest;
import com.teamg5.be.dto.RestaurantResponse;
import com.teamg5.be.dto.UpdateRestaurantRequest;
import com.teamg5.be.service.RestaurantService;
import java.util.List;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/restaurant")
@RequiredArgsConstructor

public class RestaurantController {

    private final RestaurantService restaurantService;

    @PostMapping
    @Operation(summary = "Tạo những nhà hàng trên web")
    public ResponseEntity<RestaurantResponse> createRestaurant(
            @Valid @RequestBody CreateRestaurantRequest request
    ) {
        RestaurantResponse response = restaurantService.createdRestaurant(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
        

    @GetMapping("/{restaurantId}")
     @Operation(summary = "lấy dữ liệu của 1 nhà hàng")
    public ResponseEntity<RestaurantResponse> getRestaurantById(
            @PathVariable Long restaurantId
    ) {
        RestaurantResponse response = restaurantService.getRestaurantById(restaurantId);
        return ResponseEntity.ok(response);
    }
    @PatchMapping("/{restaurantId}")
    @Operation(summary = "cập nhật thông tin nhà hàng")
    public ResponseEntity<RestaurantResponse> updateRestaurant(
        @Valid @RequestBody UpdateRestaurantRequest request , @PathVariable Long restaurantId
    ) {
        RestaurantResponse response = restaurantService.updateResponse(restaurantId, request);
        return ResponseEntity.ok(response);
    }
    //@PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{restaurantId}")
    @Operation(summary = "xóa nhà hàng (softdelete)")
    public ResponseEntity<ApiResponse<Void>> softDelete( @PathVariable Long restaurantId) {
        restaurantService.softDeleteRestaurant(restaurantId);
        ApiResponse<Void> response= ApiResponse.<Void>builder()
                    .success(true)
                    .message("delete successfull!")
                    .data(null)
                    .build();
        

         return ResponseEntity.ok(response);
    }
    @GetMapping()
     @Operation(summary = "lấy dữ liệu tất cả nhà hàng")
    public ResponseEntity<List<RestaurantResponse>> getAllRestaurant(
            
    ) {
        List<RestaurantResponse> response = restaurantService.getAllRestaurant();
        return ResponseEntity.ok(response);
    }
}
