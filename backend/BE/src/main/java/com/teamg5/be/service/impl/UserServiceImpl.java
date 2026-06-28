package com.teamg5.be.service.impl;

import com.teamg5.be.dto.UserProfileResponse;
import com.teamg5.be.dto.UserProfileUpdateRequest;
import com.teamg5.be.dto.ChangePasswordRequest;
import com.teamg5.be.entity.User;
import com.teamg5.be.exception.AppException;
import com.teamg5.be.exception.ErrorCode;
import com.teamg5.be.repository.UserRepository;
import com.teamg5.be.service.UserService;
import com.teamg5.be.utils.DateUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getMyProfile() {
        User currentUser = getCurrentUser();
        return mapToUserProfileResponse(currentUser);
    }

    @Override
    @Transactional
    public UserProfileResponse updateMyProfile(UserProfileUpdateRequest request) {
        User currentUser = getCurrentUser();

        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            user.setFullName(request.getFullName().trim());
        }

        if (request.getPhone() != null) {
            user.setPhone(request.getPhone().trim());
        }

        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl().trim());
        }

        if (request.getBio() != null) {
            user.setBio(request.getBio().trim());
        }

        User savedUser = userRepository.save(user);
        return mapToUserProfileResponse(savedUser);
    }

    @Override
    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        User currentUser = getCurrentUser();

        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS, "Mật khẩu hiện tại không khớp");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private UserProfileResponse mapToUserProfileResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .status(user.getStatus() != null ? user.getStatus().name() : null)
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .bio(user.getBio())
                .warningCount(user.getWarningCount())
                .createdAt(user.getCreatedAt() != null ? DateUtils.formatLocalDateTimeDoubleDash(user.getCreatedAt()) : null)
                .updatedAt(user.getUpdatedAt() != null ? DateUtils.formatLocalDateTimeDoubleDash(user.getUpdatedAt()) : null)
                .build();
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

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
