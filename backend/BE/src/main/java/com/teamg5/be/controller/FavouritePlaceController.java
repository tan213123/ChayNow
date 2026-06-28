package com.teamg5.be.controller;

import com.teamg5.be.dto.ApiResponse;
import com.teamg5.be.dto.PageResponse;
import com.teamg5.be.dto.FavouritePlaceResponse;
import com.teamg5.be.exception.AppException;
import com.teamg5.be.exception.ErrorCode;
import com.teamg5.be.service.FavouritePlaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/favourites")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
@Tag(name = "Favorite Places", description = "APIs for users to save and manage their favorite restaurants")
public class FavouritePlaceController {

    private final FavouritePlaceService favouritePlaceService;

    @PostMapping("/restaurants/{restaurantId}")
    @Operation(summary = "Thêm nhà hàng vào danh sách yêu thích")
    public ResponseEntity<ApiResponse<Void>> addFavourite(
            @Parameter(description = "ID của nhà hàng", example = "1")
            @PathVariable Long restaurantId
    ) {
        favouritePlaceService.addFavourite(restaurantId);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Added to favorites successfully")
                .data(null)
                .build());
    }

    @DeleteMapping("/restaurants/{restaurantId}")
    @Operation(summary = "Xóa nhà hàng khỏi danh sách yêu thích")
    public ResponseEntity<ApiResponse<Void>> removeFavourite(
            @Parameter(description = "ID của nhà hàng", example = "1")
            @PathVariable Long restaurantId
    ) {
        favouritePlaceService.removeFavourite(restaurantId);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Removed from favorites successfully")
                .data(null)
                .build());
    }

    @GetMapping("/restaurants")
    @Operation(summary = "Lấy danh sách nhà hàng yêu thích của người dùng đang đăng nhập")
    public ResponseEntity<ApiResponse<PageResponse<FavouritePlaceResponse>>> getMyFavourites(
            @Parameter(description = "Số trang (bắt đầu từ 0)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Số lượng phần tử trên mỗi trang (tối đa 50)", example = "10")
            @RequestParam(defaultValue = "10") int size
    ) {
        if (page < 0 || size <= 0 || size > 50) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Trang phải từ 0 trở lên và kích thước phải từ 1 đến 50");
        }
        PageResponse<FavouritePlaceResponse> response = favouritePlaceService.getMyFavourites(page, size);
        return ResponseEntity.ok(ApiResponse.<PageResponse<FavouritePlaceResponse>>builder()
                .success(true)
                .message("Get favorite restaurants successfully")
                .data(response)
                .build());
    }

    @GetMapping("/restaurants/{restaurantId}/status")
    @Operation(summary = "Kiểm tra trạng thái yêu thích của nhà hàng")
    public ResponseEntity<ApiResponse<Boolean>> isFavourite(
            @Parameter(description = "ID của nhà hàng", example = "1")
            @PathVariable Long restaurantId
    ) {
        boolean status = favouritePlaceService.isFavourite(restaurantId);
        return ResponseEntity.ok(ApiResponse.<Boolean>builder()
                .success(true)
                .message("Checked favorite status successfully")
                .data(status)
                .build());
    }
}
