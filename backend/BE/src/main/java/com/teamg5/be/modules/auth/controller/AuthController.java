package com.teamg5.be.modules.auth.controller;

import com.teamg5.be.modules.auth.dto.request.LoginRequest;
import com.teamg5.be.modules.auth.dto.request.RegisterRequest;
import com.teamg5.be.modules.auth.dto.response.TokenResponse;
import com.teamg5.be.modules.auth.service.AuthService;
import com.teamg5.be.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "APIs for user registration and login")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Creates a new user profile and returns a JWT access token for authentication.")
    public ResponseEntity<ApiResponse<TokenResponse>> register(@Valid @RequestBody RegisterRequest request) {
        TokenResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<TokenResponse>builder()
                .success(true)
                .message("User registered successfully")
                .data(response)
                .build());
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user", description = "Verifies user credentials (email/password) and returns a JWT access token.")
    public ResponseEntity<ApiResponse<TokenResponse>> login(@Valid @RequestBody LoginRequest request) {
        TokenResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.<TokenResponse>builder()
                .success(true)
                .message("Login successful")
                .data(response)
                .build());
    }
}
