package com.teamg5.be.service;

import com.teamg5.be.dto.AdminUserResponseDTO;
import com.teamg5.be.service.impl.AdminUserServiceImpl;
import com.teamg5.be.entity.AccountStatus;
import com.teamg5.be.entity.Role;
import com.teamg5.be.entity.User;
import com.teamg5.be.repository.UserRepository;
import com.teamg5.be.dto.PageResponse;
import com.teamg5.be.exception.AppException;
import com.teamg5.be.exception.ErrorCode;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

public class AdminUserServiceImplTest {

    private AdminUserService adminUserService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    private User currentUser;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        adminUserService = new AdminUserServiceImpl(userRepository);
        SecurityContextHolder.setContext(securityContext);

        currentUser = User.builder()
                .email("admin@chaynow.com")
                .fullName("Admin User")
                .role(Role.ADMIN)
                .status(AccountStatus.ACTIVE)
                .build();
        currentUser.setId(1L);
    }

    @AfterEach
    public void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    public void getAllUsers_ValidParameters_ReturnsPageResponse() {
        // Arrange
        User user = User.builder()
                .email("test@example.com")
                .fullName("Test User")
                .role(Role.USER)
                .status(AccountStatus.ACTIVE)
                .avatarUrl("avatar.png")
                .build();
        user.setId(2L);
        user.setCreatedAt(LocalDateTime.of(2026, 6, 6, 12, 0));

        Object[] row = new Object[]{user, 5L}; // User and 5 reviews
        Page<Object[]> pageResult = new PageImpl<>(Collections.singletonList(row), PageRequest.of(0, 6), 1);

        when(userRepository.findAllAdminUsers(
                eq("Test"),
                eq(Role.USER),
                eq(AccountStatus.ACTIVE),
                any(Pageable.class)
        )).thenReturn(pageResult);

        // Act
        PageResponse<AdminUserResponseDTO> response = adminUserService.getAllUsers(0, 6, "Test", "USER", "ACTIVE");

        // Assert
        assertNotNull(response);
        assertEquals(1, response.getContent().size());
        AdminUserResponseDTO dto = response.getContent().get(0);
        assertEquals(2L, dto.getId());
        assertEquals("Test User", dto.getFullName());
        assertEquals("test@example.com", dto.getEmail());
        assertEquals("USER", dto.getRole());
        assertEquals("ACTIVE", dto.getStatus());
        assertEquals(5, dto.getReviewCount());
        assertEquals("avatar.png", dto.getAvatarUrl());
        assertEquals("06--06--2026", dto.getJoinedDate());
    }

    @Test
    public void getAllUsers_InvalidRole_ThrowsException() {
        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> {
            adminUserService.getAllUsers(0, 6, "", "INVALID_ROLE", "");
        });
        assertTrue(exception.getMessage().contains("Invalid role parameter"));
    }

    @Test
    public void getAllUsers_InvalidStatus_ThrowsException() {
        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> {
            adminUserService.getAllUsers(0, 6, "", "", "INVALID_STATUS");
        });
        assertTrue(exception.getMessage().contains("Invalid status parameter"));
    }

    @Test
    public void suspendUser_Success() {
        // Arrange
        User targetUser = User.builder()
                .email("user@example.com")
                .fullName("Target User")
                .status(AccountStatus.ACTIVE)
                .build();
        targetUser.setId(2L);

        when(userRepository.findById(2L)).thenReturn(Optional.of(targetUser));
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(currentUser);
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);

        // Act
        adminUserService.suspendUser(2L);

        // Assert
        assertEquals(AccountStatus.SUSPENDED, targetUser.getStatus());
        verify(userRepository, times(1)).save(targetUser);
    }

    @Test
    public void suspendUser_SelfSuspend_ThrowsException() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(currentUser));
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(currentUser);

        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> adminUserService.suspendUser(1L));
        assertEquals(ErrorCode.INVALID_INPUT, exception.getErrorCode());
        assertEquals("You cannot suspend yourself", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    public void suspendUser_UserNotFound_ThrowsException() {
        // Arrange
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> adminUserService.suspendUser(99L));
        assertEquals(ErrorCode.USER_NOT_FOUND, exception.getErrorCode());
    }

    @Test
    public void activateUser_Success() {
        // Arrange
        User targetUser = User.builder()
                .email("user@example.com")
                .fullName("Target User")
                .status(AccountStatus.SUSPENDED)
                .build();
        targetUser.setId(2L);

        when(userRepository.findById(2L)).thenReturn(Optional.of(targetUser));
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(currentUser);
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);

        // Act
        adminUserService.activateUser(2L);

        // Assert
        assertEquals(AccountStatus.ACTIVE, targetUser.getStatus());
        verify(userRepository, times(1)).save(targetUser);
    }

    @Test
    public void activateUser_SelfActivate_ThrowsException() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(currentUser));
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(currentUser);

        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> adminUserService.activateUser(1L));
        assertEquals(ErrorCode.INVALID_INPUT, exception.getErrorCode());
        assertEquals("You cannot activate yourself", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    public void activateUser_UserNotFound_ThrowsException() {
        // Arrange
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> adminUserService.activateUser(99L));
        assertEquals(ErrorCode.USER_NOT_FOUND, exception.getErrorCode());
    }
}
