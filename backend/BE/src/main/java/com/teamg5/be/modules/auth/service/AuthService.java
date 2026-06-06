package com.teamg5.be.modules.auth.service;

import com.teamg5.be.modules.auth.dto.request.LoginRequest;
import com.teamg5.be.modules.auth.dto.request.RegisterRequest;
import com.teamg5.be.modules.auth.dto.response.TokenResponse;

public interface AuthService {
    TokenResponse register(RegisterRequest request);
    TokenResponse login(LoginRequest request);
}
