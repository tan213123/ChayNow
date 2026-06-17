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
import com.teamg5.be.dto.CreateMenuRequest;
import com.teamg5.be.dto.MenuResponse;
import com.teamg5.be.dto.UpdateMenuRequest;
import com.teamg5.be.service.MenuService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MenuController {
    private final MenuService menuService;

    @PostMapping("/restaurants/{restaurantId}/menus")
   // @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Tạo món ăn cho nhà hàng")
    public ResponseEntity<MenuResponse> createMenu(
            @PathVariable Long restaurantId,
            @Valid @RequestBody CreateMenuRequest request
    ) {
        MenuResponse response =
                menuService.createMenu(restaurantId, request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
// lấy menu theo nha hang
    @GetMapping("/restaurants/{restaurantId}/menus")
    @Operation(summary = "Lấy danh sách món ăn của nhà hàng")
    public ResponseEntity<List<MenuResponse>> getMenusByRestaurant(
            @PathVariable Long restaurantId
    ) {
        List<MenuResponse> response =
                menuService.getMenusByRestaurant(restaurantId);

        return ResponseEntity.ok(response);
    }
    // lấy full dữ liệu của hệ thống
        @GetMapping("/menus")
    @Operation(summary = "Lấy tất cả món ăn đang hoạt động")
    public ResponseEntity<List<MenuResponse>> getAllMenus() {
        return ResponseEntity.ok(
                menuService.getAllMenus()
        );
    }
     // lấy theo Id
    @GetMapping("/menus/{menuId}")
    @Operation(summary = "Lấy món ăn theo ID")
    public ResponseEntity<MenuResponse> getMenuById(
            @PathVariable Long menuId
    ) {
        return ResponseEntity.ok(
                menuService.getMenuById(menuId)
        );
    }
    // update
    @PatchMapping("/menus/{menuId}")
    //@PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Cập nhật món ăn")
    public ResponseEntity<MenuResponse> updateMenu(
            @PathVariable Long menuId,
            @Valid @RequestBody UpdateMenuRequest request
    ) {
        MenuResponse response =
                menuService.updateMenu(menuId, request);

        return ResponseEntity.ok(response);
    }
     
    @DeleteMapping("/menus/{menuId}")
   // @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Xóa mềm món ăn")
    public ResponseEntity<ApiResponse<Void>> softDeleteMenu(
            @PathVariable Long menuId
    ) {
        menuService.softDeleteMenu(menuId);

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message("Xóa món ăn thành công")
                .data(null)
                .build();

        return ResponseEntity.ok(response);
    }

}
