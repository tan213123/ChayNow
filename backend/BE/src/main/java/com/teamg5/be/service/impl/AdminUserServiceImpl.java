package com.teamg5.be.service.impl;

import com.teamg5.be.dto.AdminUserResponseDTO;
import com.teamg5.be.dto.AdminUserDetailResponse;
import com.teamg5.be.service.AdminUserService;
import com.teamg5.be.entity.AccountStatus;
import com.teamg5.be.entity.Role;
import com.teamg5.be.entity.User;
import com.teamg5.be.entity.RestaurantStatus;
import com.teamg5.be.entity.ReportStatus;
import com.teamg5.be.repository.UserRepository;
import com.teamg5.be.repository.RestaurantRepository;
import com.teamg5.be.repository.ReviewRepository;
import com.teamg5.be.repository.PostingRepository;
import com.teamg5.be.repository.ReportRepository;
import com.teamg5.be.dto.PageResponse;
import com.teamg5.be.dto.DashboardStatsResponse;
import com.teamg5.be.exception.AppException;
import com.teamg5.be.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import com.teamg5.be.dto.CreateAdminRequest;
import com.teamg5.be.dto.UpdateUserRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.teamg5.be.utils.DateUtils;

@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RestaurantRepository restaurantRepository;
    private final ReviewRepository reviewRepository;
    private final PostingRepository postingRepository;
    private final ReportRepository reportRepository;

    @Override
    public PageResponse<AdminUserResponseDTO> getAllUsers(
            int page,
            int size,
            String keyword,
            String roleStr,
            String statusStr
    ) {
        Pageable pageable = PageRequest.of(page, size);

        Role role = null;
        if (roleStr != null && !roleStr.trim().isEmpty()) {
            try {
                role = Role.valueOf(roleStr.trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new AppException(ErrorCode.INVALID_INPUT, "Invalid role parameter: " + roleStr);
            }
        }

        AccountStatus status = null;
        if (statusStr != null && !statusStr.trim().isEmpty()) {
            try {
                status = AccountStatus.valueOf(statusStr.trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new AppException(ErrorCode.INVALID_INPUT, "Invalid status parameter: " + statusStr);
            }
        }

        Page<Object[]> dbPage = userRepository.findAllAdminUsers(
                keyword != null ? keyword.trim() : null,
                role,
                status,
                pageable
        );

        List<AdminUserResponseDTO> content = dbPage.getContent().stream()
                .map(row -> {
                    User user = (User) row[0];
                    Long reviewCount = (Long) row[1];

                    return AdminUserResponseDTO.builder()
                            .id(user.getId())
                            .fullName(user.getFullName())
                            .email(user.getEmail())
                            .avatarUrl(user.getAvatarUrl())
                            .role(user.getRole() != null ? user.getRole().name() : null)
                            .status(user.getStatus() != null ? user.getStatus().name() : null)
                            .reviewCount(reviewCount != null ? reviewCount.intValue() : 0)
                            .joinedDate(user.getCreatedAt() != null ? DateUtils.formatLocalDateTimeDoubleDash(user.getCreatedAt()) : null)
                            .build();
                })
                .collect(Collectors.toList());

        return PageResponse.<AdminUserResponseDTO>builder()
                .content(content)
                .page(dbPage.getNumber())
                .size(dbPage.getSize())
                .totalElements(dbPage.getTotalElements())
                .totalPages(dbPage.getTotalPages())
                .last(dbPage.isLast())
                .build();
    }

    // ===================== GET USER BY ID =====================
    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public AdminUserDetailResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND, "User not found with id: " + userId));

        long reviewCount = userRepository.countReviewsByUserId(userId);

        return AdminUserDetailResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .phone(user.getPhone())
                .bio(user.getBio())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .status(user.getStatus() != null ? user.getStatus().name() : null)
                .warningCount(user.getWarningCount())
                .reviewCount((int) reviewCount)
                .createdAt(DateUtils.formatLocalDateTimeDoubleDash(user.getCreatedAt()))
                .updatedAt(DateUtils.formatLocalDateTimeDoubleDash(user.getUpdatedAt()))
                .build();
    }

    // ===================== UPDATE USER =====================
    @Override
    @org.springframework.transaction.annotation.Transactional
    public AdminUserDetailResponse updateUser(Long userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND, "User not found with id: " + userId));

        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            user.setFullName(request.getFullName().trim());
        }

        if (request.getPhone() != null) {
            user.setPhone(request.getPhone().trim());
        }

        if (request.getRole() != null && !request.getRole().trim().isEmpty()) {
            try {
                Role role = Role.valueOf(request.getRole().trim().toUpperCase());
                user.setRole(role);
            } catch (IllegalArgumentException e) {
                throw new AppException(ErrorCode.INVALID_INPUT, "Invalid role: " + request.getRole());
            }
        }

        if (request.getStatus() != null && !request.getStatus().trim().isEmpty()) {
            try {
                AccountStatus status = AccountStatus.valueOf(request.getStatus().trim().toUpperCase());
                user.setStatus(status);
            } catch (IllegalArgumentException e) {
                throw new AppException(ErrorCode.INVALID_INPUT, "Invalid status: " + request.getStatus());
            }
        }

        User saved = userRepository.save(user);
        long reviewCount = userRepository.countReviewsByUserId(userId);

        return AdminUserDetailResponse.builder()
                .id(saved.getId())
                .fullName(saved.getFullName())
                .email(saved.getEmail())
                .avatarUrl(saved.getAvatarUrl())
                .phone(saved.getPhone())
                .bio(saved.getBio())
                .role(saved.getRole() != null ? saved.getRole().name() : null)
                .status(saved.getStatus() != null ? saved.getStatus().name() : null)
                .warningCount(saved.getWarningCount())
                .reviewCount((int) reviewCount)
                .createdAt(DateUtils.formatLocalDateTimeDoubleDash(saved.getCreatedAt()))
                .updatedAt(DateUtils.formatLocalDateTimeDoubleDash(saved.getUpdatedAt()))
                .build();
    }

    // ===================== DELETE USER =====================
    @Override
    @org.springframework.transaction.annotation.Transactional
    public void deleteUser(Long userId) {
        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND, "User not found with id: " + userId));

        User currentUser = getCurrentUser();
        if (currentUser.getId().equals(targetUser.getId())) {
            throw new AppException(ErrorCode.INVALID_INPUT, "You cannot delete yourself");
        }

        userRepository.delete(targetUser);
    }

    // ===================== SUSPEND / ACTIVATE =====================
    @Override
    @org.springframework.transaction.annotation.Transactional
    public void suspendUser(Long userId) {
        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND, "User not found"));

        User currentUser = getCurrentUser();
        if (currentUser.getId().equals(targetUser.getId())) {
            throw new AppException(ErrorCode.INVALID_INPUT, "You cannot suspend yourself");
        }

        targetUser.setStatus(AccountStatus.SUSPENDED);
        userRepository.save(targetUser);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void activateUser(Long userId) {
        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND, "User not found"));

        User currentUser = getCurrentUser();
        if (currentUser.getId().equals(targetUser.getId())) {
            throw new AppException(ErrorCode.INVALID_INPUT, "You cannot activate yourself");
        }

        targetUser.setStatus(AccountStatus.ACTIVE);
        userRepository.save(targetUser);
    }

    // ===================== HELPER =====================
    private User getCurrentUser() {
        org.springframework.security.core.Authentication authentication =
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof User user) {
            return user;
        }

        String email = authentication.getName();
        if (email == null || email.equals("anonymousUser")) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    private void verifyAdmin() {
        User currentUser = getCurrentUser();
        if (currentUser.getRole() != Role.ADMIN) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }
    }

    // ===================== CREATE ADMIN =====================
    @Override
    @org.springframework.transaction.annotation.Transactional
    public AdminUserResponseDTO createAdmin(CreateAdminRequest request) {
        verifyAdmin();

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Email is already in use");
        }

        User newAdmin = User.builder()
                .email(request.getEmail().trim())
                .fullName(request.getFullName().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ADMIN)
                .status(AccountStatus.ACTIVE)
                .phone(request.getPhone() != null ? request.getPhone().trim() : null)
                .build();

        User saved = userRepository.save(newAdmin);

        return AdminUserResponseDTO.builder()
                .id(saved.getId())
                .fullName(saved.getFullName())
                .email(saved.getEmail())
                .avatarUrl(saved.getAvatarUrl())
                .role(saved.getRole() != null ? saved.getRole().name() : null)
                .status(saved.getStatus() != null ? saved.getStatus().name() : null)
                .reviewCount(0)
                .joinedDate(saved.getCreatedAt() != null ? DateUtils.formatLocalDateTimeDoubleDash(saved.getCreatedAt()) : DateUtils.formatLocalDateTimeDoubleDash(java.time.LocalDateTime.now()))
                .build();
    }

    // ===================== DASHBOARD STATS =====================
    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        verifyAdmin();

        long totalUsers = userRepository.countByRole(Role.USER);
        long totalOwners = userRepository.countByRole(Role.OWNER);
        long totalAdmins = userRepository.countByRole(Role.ADMIN);

        long totalRestaurants = restaurantRepository.count();
        long pendingRestaurants = restaurantRepository.countByStatus(RestaurantStatus.PENDING);
        long approvedRestaurants = restaurantRepository.countByStatus(RestaurantStatus.APPROVED);
        long rejectedRestaurants = restaurantRepository.countByStatus(RestaurantStatus.REJECTED);

        long totalReviews = reviewRepository.count();
        long totalPostings = postingRepository.count();

        long pendingReports = reportRepository.countByStatus(ReportStatus.PENDING);
        long resolvedReports = reportRepository.countByStatus(ReportStatus.RESOLVED);
        long rejectedReports = reportRepository.countByStatus(ReportStatus.REJECTED);

        return DashboardStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalOwners(totalOwners)
                .totalAdmins(totalAdmins)
                .totalRestaurants(totalRestaurants)
                .pendingRestaurants(pendingRestaurants)
                .approvedRestaurants(approvedRestaurants)
                .rejectedRestaurants(rejectedRestaurants)
                .totalReviews(totalReviews)
                .totalPostings(totalPostings)
                .pendingReports(pendingReports)
                .resolvedReports(resolvedReports)
                .rejectedReports(rejectedReports)
                .build();
    }
}
