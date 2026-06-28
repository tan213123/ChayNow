package com.teamg5.be.service;

import com.teamg5.be.dto.AdminUserResponseDTO;
import com.teamg5.be.dto.CreateAdminRequest;
import com.teamg5.be.service.impl.AdminUserServiceImpl;
import com.teamg5.be.entity.AccountStatus;
import com.teamg5.be.entity.Role;
import com.teamg5.be.entity.User;
import com.teamg5.be.repository.UserRepository;
import com.teamg5.be.repository.RestaurantRepository;
import com.teamg5.be.repository.ReviewRepository;
import com.teamg5.be.repository.PostingRepository;
import com.teamg5.be.repository.ReportRepository;
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
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Mock
    private RestaurantRepository restaurantRepository;

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private PostingRepository postingRepository;

    @Mock
    private ReportRepository reportRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    private User currentUser;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        adminUserService = new AdminUserServiceImpl(
                userRepository,
                passwordEncoder,
                restaurantRepository,
                reviewRepository,
                postingRepository,
                reportRepository
        );
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
        assertEquals("06-06-2026", dto.getJoinedDate());
    }

    @Test
    public void getAllUsers_InvalidRole_ThrowsException() {
        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> {
            adminUserService.getAllUsers(0, 6, "", "INVALID_ROLE", "");
        });
        assertTrue(exception.getMessage().contains("Tham số vai trò không hợp lệ"));
    }

    @Test
    public void getAllUsers_InvalidStatus_ThrowsException() {
        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> {
            adminUserService.getAllUsers(0, 6, "", "", "INVALID_STATUS");
        });
        assertTrue(exception.getMessage().contains("Tham số trạng thái không hợp lệ"));
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
        assertEquals("Bạn không thể tự khóa tài khoản của chính mình", exception.getMessage());
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
        assertEquals("Bạn không thể tự kích hoạt tài khoản của chính mình", exception.getMessage());
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

    @Test
    public void createAdmin_Success() {
        // Arrange
        CreateAdminRequest request = new CreateAdminRequest();
        request.setEmail("new_admin@chaynow.com");
        request.setPassword("admin123");
        request.setFullName("New Admin");
        request.setPhone("0987654321");

        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(currentUser);
        when(userRepository.existsByEmail("new_admin@chaynow.com")).thenReturn(false);
        when(passwordEncoder.encode("admin123")).thenReturn("encodedPassword");

        User savedUser = User.builder()
                .email("new_admin@chaynow.com")
                .fullName("New Admin")
                .password("encodedPassword")
                .role(Role.ADMIN)
                .status(AccountStatus.ACTIVE)
                .phone("0987654321")
                .build();
        savedUser.setId(3L);
        savedUser.setCreatedAt(LocalDateTime.now());

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // Act
        AdminUserResponseDTO response = adminUserService.createAdmin(request);

        // Assert
        assertNotNull(response);
        assertEquals(3L, response.getId());
        assertEquals("New Admin", response.getFullName());
        assertEquals("new_admin@chaynow.com", response.getEmail());
        assertEquals("ADMIN", response.getRole());
        assertEquals("ACTIVE", response.getStatus());
    }

    @Test
    public void createAdmin_Forbidden_NotAdmin() {
        // Arrange
        CreateAdminRequest request = new CreateAdminRequest();
        User customerUser = User.builder()
                .email("customer@chaynow.com")
                .fullName("Customer")
                .role(Role.USER)
                .status(AccountStatus.ACTIVE)
                .build();

        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(customerUser);

        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> adminUserService.createAdmin(request));
        assertEquals(ErrorCode.FORBIDDEN, exception.getErrorCode());
    }

    @Test
    public void createAdmin_EmailAlreadyInUse() {
        // Arrange
        CreateAdminRequest request = new CreateAdminRequest();
        request.setEmail("existing@chaynow.com");

        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(currentUser);
        when(userRepository.existsByEmail("existing@chaynow.com")).thenReturn(true);

        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> adminUserService.createAdmin(request));
        assertEquals(ErrorCode.INVALID_INPUT, exception.getErrorCode());
        assertTrue(exception.getMessage().contains("Email đã được sử dụng"));
    }
}
