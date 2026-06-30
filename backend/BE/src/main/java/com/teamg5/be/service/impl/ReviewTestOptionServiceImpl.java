package com.teamg5.be.service.impl;

import com.teamg5.be.dto.CreateReviewTestOptionRequest;
import com.teamg5.be.dto.ReviewTestOptionClickUserResponse;
import com.teamg5.be.dto.ReviewTestOptionResponse;
import com.teamg5.be.entity.Restaurant;
import com.teamg5.be.entity.ReviewTestOption;
import com.teamg5.be.entity.ReviewTestOptionClick;
import com.teamg5.be.entity.Role;
import com.teamg5.be.entity.User;
import com.teamg5.be.exception.AppException;
import com.teamg5.be.exception.ErrorCode;
import com.teamg5.be.repository.RestaurantRepository;
import com.teamg5.be.repository.ReviewTestOptionClickRepository;
import com.teamg5.be.repository.ReviewTestOptionRepository;
import com.teamg5.be.repository.UserRepository;
import com.teamg5.be.service.ReviewTestOptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewTestOptionServiceImpl implements ReviewTestOptionService {

    private final ReviewTestOptionRepository optionRepository;
    private final ReviewTestOptionClickRepository clickRepository;
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ReviewTestOptionResponse> getOptionsForRestaurant(Long restaurantId) {
        User currentUser = getCurrentUserOrNull();
        restaurantRepository.findByIdAndActiveTrue(restaurantId)
                .orElseThrow(() -> new AppException(ErrorCode.RESTAURANT_NOT_FOUND));

        return optionRepository.findByActiveTrueOrderByDisplayOrderAscIdAsc()
                .stream()
                .map(option -> ReviewTestOptionResponse.from(
                        option,
                        clickRepository.countByRestaurant_IdAndOption_Id(restaurantId, option.getId()),
                        currentUser != null && clickRepository.existsByUser_IdAndRestaurant_IdAndOption_Id(
                                currentUser.getId(),
                                restaurantId,
                                option.getId()
                        )
                ))
                .toList();
    }

    @Override
    public ReviewTestOptionResponse clickOption(Long restaurantId, Long optionId) {
        User currentUser = getCurrentUser();
        Restaurant restaurant = restaurantRepository.findByIdAndActiveTrue(restaurantId)
                .orElseThrow(() -> new AppException(ErrorCode.RESTAURANT_NOT_FOUND));
        ReviewTestOption option = getActiveOption(optionId);

        if (!clickRepository.existsByUser_IdAndRestaurant_IdAndOption_Id(currentUser.getId(), restaurantId, optionId)) {
            ReviewTestOptionClick click = ReviewTestOptionClick.builder()
                    .user(currentUser)
                    .restaurant(restaurant)
                    .option(option)
                    .build();
            clickRepository.save(click);
        }

        return ReviewTestOptionResponse.from(
                option,
                clickRepository.countByRestaurant_IdAndOption_Id(restaurantId, optionId),
                true
        );
    }

    @Override
    public void unclickOption(Long restaurantId, Long optionId) {
        User currentUser = getCurrentUser();
        restaurantRepository.findByIdAndActiveTrue(restaurantId)
                .orElseThrow(() -> new AppException(ErrorCode.RESTAURANT_NOT_FOUND));
        getActiveOption(optionId);

        clickRepository.findByUser_IdAndRestaurant_IdAndOption_Id(currentUser.getId(), restaurantId, optionId)
                .ifPresent(clickRepository::delete);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewTestOptionClickUserResponse> getClickedUsers(Long restaurantId, Long optionId) {
        User currentUser = getCurrentUser();
        Restaurant restaurant = restaurantRepository.findByIdAndActiveTrue(restaurantId)
                .orElseThrow(() -> new AppException(ErrorCode.RESTAURANT_NOT_FOUND));
        getActiveOption(optionId);

        if (!canViewClickedUsers(currentUser, restaurant)) {
            throw new AppException(ErrorCode.FORBIDDEN, "Bạn không có quyền xem danh sách người dùng đã chọn tiêu chí này");
        }

        return clickRepository.findByRestaurant_IdAndOption_IdOrderByCreatedAtDesc(restaurantId, optionId)
                .stream()
                .map(ReviewTestOptionClickUserResponse::from)
                .toList();
    }

    @Override
    public ReviewTestOptionResponse createOption(CreateReviewTestOptionRequest request) {
        User currentUser = getCurrentUser();
        if (currentUser.getRole() != Role.ADMIN) {
            throw new AppException(ErrorCode.FORBIDDEN, "Chỉ admin được tạo tiêu chí đánh giá nhanh");
        }

        String label = request.getLabel().trim();
        if (optionRepository.existsByLabelIgnoreCase(label)) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Lựa chọn này đã tồn tại");
        }

        ReviewTestOption option = ReviewTestOption.builder()
                .label(label)
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .active(true)
                .build();

        ReviewTestOption saved = optionRepository.save(option);
        return ReviewTestOptionResponse.from(saved, 0, false);
    }

    private ReviewTestOption getActiveOption(Long optionId) {
        ReviewTestOption option = optionRepository.findById(optionId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Không tìm thấy lựa chọn đánh giá"));
        if (!Boolean.TRUE.equals(option.getActive())) {
            throw new AppException(ErrorCode.NOT_FOUND, "Lựa chọn đánh giá đã bị tắt");
        }
        return option;
    }

    private boolean canViewClickedUsers(User user, Restaurant restaurant) {
        if (user.getRole() == Role.ADMIN) {
            return true;
        }
        return restaurant.getOwner() != null && restaurant.getOwner().getId().equals(user.getId());
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

    private User getCurrentUserOrNull() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof User user) {
            return user;
        }

        String email = authentication.getName();
        if (email == null || email.equals("anonymousUser")) {
            return null;
        }

        return userRepository.findByEmail(email).orElse(null);
    }
}
