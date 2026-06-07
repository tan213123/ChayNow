package com.teamg5.be.service;

import com.teamg5.be.dto.LoginRequest;
import com.teamg5.be.dto.RegisterRequest;
import com.teamg5.be.dto.TokenResponse;

public interface AuthService {
    TokenResponse register(RegisterRequest request);
    TokenResponse login(LoginRequest request);
}
