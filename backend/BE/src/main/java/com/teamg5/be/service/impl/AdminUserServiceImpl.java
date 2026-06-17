package com.teamg5.be.service.impl;

import com.teamg5.be.dto.AdminUserResponseDTO;
import com.teamg5.be.service.AdminUserService;
import com.teamg5.be.entity.AccountStatus;
import com.teamg5.be.entity.Role;
import com.teamg5.be.entity.User;
import com.teamg5.be.repository.UserRepository;
import com.teamg5.be.dto.PageResponse;
import com.teamg5.be.exception.AppException;
import com.teamg5.be.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import com.teamg5.be.utils.DateUtils;

@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {

    private final UserRepository userRepository;

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
}
