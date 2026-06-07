package com.teamg5.be.service;

import com.teamg5.be.dto.AdminUserResponseDTO;
import com.teamg5.be.service.impl.AdminUserServiceImpl;
import com.teamg5.be.entity.AccountStatus;
import com.teamg5.be.entity.Role;
import com.teamg5.be.entity.User;
import com.teamg5.be.repository.UserRepository;
import com.teamg5.be.dto.PageResponse;
import com.teamg5.be.exception.AppException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

public class AdminUserServiceImplTest {

    private AdminUserService adminUserService;

    @Mock
    private UserRepository userRepository;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        adminUserService = new AdminUserServiceImpl(userRepository);
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
        user.setId(1L);
        user.setCreatedAt(LocalDateTime.of(2026, 6, 6, 12, 0));

        Object[] row = new Object[]{user, 5L}; // User and 5 reviews
        Page<Object[]> pageResult = new PageImpl<>(java.util.Collections.singletonList(row), PageRequest.of(0, 6), 1);

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
        assertEquals(1L, dto.getId());
        assertEquals("Test User", dto.getFullName());
        assertEquals("test@example.com", dto.getEmail());
        assertEquals("USER", dto.getRole());
        assertEquals("ACTIVE", dto.getStatus());
        assertEquals(5, dto.getReviewCount());
        assertEquals("avatar.png", dto.getAvatarUrl());
        assertEquals("06--06--2026", dto.getJoinedDate());
        assertEquals(0, response.getPage());
        assertEquals(6, response.getSize());
        assertEquals(1L, response.getTotalElements());
        assertTrue(response.isLast());
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
}
