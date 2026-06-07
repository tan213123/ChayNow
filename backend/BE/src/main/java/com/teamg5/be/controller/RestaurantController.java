package com.teamg5.be.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.teamg5.be.dto.CreateRestaurantRequest;
import com.teamg5.be.dto.RestaurantResponse;
import com.teamg5.be.service.RestaurantService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/restaurant")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;

    @PostMapping
    public ResponseEntity<RestaurantResponse> createRestaurant(
            @Valid @RequestBody CreateRestaurantRequest request
    ) {
        RestaurantResponse response = restaurantService.createdRestaurant(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{restaurantId}")
    public ResponseEntity<RestaurantResponse> getRestaurantById(
            @PathVariable Long restaurantId
    ) {
        RestaurantResponse response = restaurantService.getRestaurantById(restaurantId);
        return ResponseEntity.ok(response);
    }
}
