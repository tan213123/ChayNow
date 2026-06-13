package com.teamg5.be.service.impl;

import com.teamg5.be.dto.LoginRequest;
import com.teamg5.be.dto.RegisterRequest;
import com.teamg5.be.dto.TokenResponse;
import com.teamg5.be.entity.AccountStatus;
import com.teamg5.be.entity.Role;
import com.teamg5.be.entity.User;
import com.teamg5.be.exception.AppException;
import com.teamg5.be.exception.ErrorCode;
import com.teamg5.be.repository.UserRepository;
import com.teamg5.be.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class AuthServiceImplTest {

    @InjectMocks
    private AuthServiceImpl authService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        ReflectionTestUtils.setField(authService, "jwtExpiration", 86400000L);
    }

    @Test
    public void register_ValidRequest_Success() {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setPassword("password123");
        request.setFullName("Test User");

        User savedUser = User.builder()
                .email("test@example.com")
                .fullName("Test User")
                .role(Role.USER)
                .status(AccountStatus.ACTIVE)
                .build();
        savedUser.setId(1L);

        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtService.generateToken(savedUser)).thenReturn("mockJwtToken");

        // Act
        TokenResponse response = authService.register(request);

        // Assert
        assertNotNull(response);
        assertEquals("mockJwtToken", response.getAccessToken());
        assertEquals("test@example.com", response.getEmail());
        assertEquals("Test User", response.getFullName());
        assertEquals(Role.USER, response.getRole());
        assertEquals(1L, response.getId());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    public void register_EmailAlreadyExists_ThrowsException() {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");

        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> authService.register(request));
        assertEquals(ErrorCode.USER_ALREADY_EXISTS, exception.getErrorCode());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    public void login_ValidCredentials_Success() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("password123");

        User user = User.builder()
                .email("test@example.com")
                .fullName("Test User")
                .role(Role.USER)
                .status(AccountStatus.ACTIVE)
                .build();
        user.setId(1L);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(null);
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(jwtService.generateToken(user)).thenReturn("mockJwtToken");

        // Act
        TokenResponse response = authService.login(request);

        // Assert
        assertNotNull(response);
        assertEquals("mockJwtToken", response.getAccessToken());
        assertEquals("test@example.com", response.getEmail());
        assertEquals(1L, response.getId());
    }

    @Test
    public void login_InvalidCredentials_ThrowsException() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("wrongpassword");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new AuthenticationException("Bad credentials") {});

        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> authService.login(request));
        assertEquals(ErrorCode.INVALID_CREDENTIALS, exception.getErrorCode());
        verify(userRepository, never()).findByEmail(anyString());
    }

    @Test
    public void login_UserNotFound_ThrowsException() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("password123");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(null);
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());

        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> authService.login(request));
        assertEquals(ErrorCode.NOT_FOUND, exception.getErrorCode());
    }
}
