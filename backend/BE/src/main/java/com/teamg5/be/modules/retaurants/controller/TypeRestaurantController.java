package com.teamg5.be.modules.retaurants.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.teamg5.be.modules.retaurants.dto.request.CreateTypeRestaurantRequest;
import com.teamg5.be.modules.retaurants.dto.response.TypeRestaurantResponse;
import com.teamg5.be.modules.retaurants.service.TypeRestaurantService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/type-restaurant")
@RequiredArgsConstructor
public class TypeRestaurantController {
    private final TypeRestaurantService typeRestaurantService;

    @PostMapping
    public ResponseEntity<TypeRestaurantResponse> createTypeRestaurant(
            @Valid @RequestBody CreateTypeRestaurantRequest request
    ) {
        TypeRestaurantResponse response = typeRestaurantService.createdTypeRestaurant(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<?> getAllTypeRestaurants() {
        return ResponseEntity.ok(typeRestaurantService.getAllTypeRestaurant());
    }

    @GetMapping("/{typeRestaurantId}")
    public ResponseEntity<TypeRestaurantResponse> getTypeRestaurantById(
            @PathVariable Long typeRestaurantId
    ) {
        TypeRestaurantResponse response = typeRestaurantService.getTypeRestaurantById(typeRestaurantId);
        return ResponseEntity.ok(response);
    }
}
