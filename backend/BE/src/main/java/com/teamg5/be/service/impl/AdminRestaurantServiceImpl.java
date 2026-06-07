package com.teamg5.be.service.impl;

import com.teamg5.be.dto.AdminRestaurantResponseDTO;
import com.teamg5.be.dto.PageResponseDTO;
import com.teamg5.be.dto.RejectRestaurantRequestDTO;
import com.teamg5.be.entity.Restaurant;
import com.teamg5.be.entity.RestaurantStatus;
import com.teamg5.be.entity.User;
import com.teamg5.be.exception.AppException;
import com.teamg5.be.exception.ErrorCode;
import com.teamg5.be.repository.RestaurantRepository;
import com.teamg5.be.repository.UserRepository;
import com.teamg5.be.service.AdminRestaurantService;
import com.teamg5.be.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminRestaurantServiceImpl implements AdminRestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public PageResponseDTO<AdminRestaurantResponseDTO> getAllRestaurants(
            String keyword,
            String status,
            Long placeId,
            int page,
            int size
    ) {
        if (size > 50) {
            size = 50;
        }
        Pageable pageable = PageRequest.of(page, size);

        RestaurantStatus statusEnum = null;
        if (status != null && !status.trim().isEmpty()) {
            try {
                statusEnum = RestaurantStatus.valueOf(status.trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new AppException(ErrorCode.INVALID_INPUT, "Invalid status: " + status);
            }
        }

        Page<Restaurant> dbPage = restaurantRepository.findAllForAdmin(
                keyword != null ? keyword.trim() : null,
                statusEnum,
                placeId,
                pageable
        );

        List<AdminRestaurantResponseDTO> content = dbPage.getContent().stream()
                .map(this::mapToDTO)
                .toList();

        return PageResponseDTO.<AdminRestaurantResponseDTO>builder()
                .content(content)
                .page(dbPage.getNumber())
                .size(dbPage.getSize())
                .totalElements(dbPage.getTotalElements())
                .totalPages(dbPage.getTotalPages())
                .last(dbPage.isLast())
                .build();
    }

    @Override
    @Transactional
    public AdminRestaurantResponseDTO approveRestaurant(Long restaurantId) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new AppException(ErrorCode.RESTAURANT_NOT_FOUND));

        User currentAdmin = getCurrentAdmin();

        restaurant.setStatus(RestaurantStatus.APPROVED);
        restaurant.setApprovedBy(currentAdmin.getId());
        restaurant.setApprovedAt(LocalDateTime.now());
        restaurant.setRejectReason(null);

        Restaurant saved = restaurantRepository.save(restaurant);
        return mapToDTO(saved);
    }

    @Override
    @Transactional
    public AdminRestaurantResponseDTO rejectRestaurant(Long restaurantId, RejectRestaurantRequestDTO request) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new AppException(ErrorCode.RESTAURANT_NOT_FOUND));

        if (request == null || request.getReason() == null || request.getReason().trim().isEmpty()) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Reason is required for rejection");
        }

        User currentAdmin = getCurrentAdmin();

        restaurant.setStatus(RestaurantStatus.REJECTED);
        restaurant.setRejectReason(request.getReason().trim());
        restaurant.setApprovedBy(currentAdmin.getId());
        restaurant.setApprovedAt(LocalDateTime.now());

        Restaurant saved = restaurantRepository.save(restaurant);
        return mapToDTO(saved);
    }

    private User getCurrentAdmin() {
        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED));
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    private AdminRestaurantResponseDTO mapToDTO(Restaurant restaurant) {
        String thumbnailUrl = null;
        if (restaurant.getMediaList() != null && !restaurant.getMediaList().isEmpty()) {
            thumbnailUrl = restaurant.getMediaList().get(0).getUrl();
        }

        double rating = 0.0;
        int reviewCount = 0;
        if (restaurant.getReviews() != null && !restaurant.getReviews().isEmpty()) {
            reviewCount = restaurant.getReviews().size();
            double sum = 0.0;
            for (var r : restaurant.getReviews()) {
                if (r.getRating() != null) {
                    sum += r.getRating();
                }
            }
            rating = sum / reviewCount;
        }

        return AdminRestaurantResponseDTO.builder()
                .id(restaurant.getId())
                .name(restaurant.getName())
                .address(restaurant.getAddress())
                .thumbnailUrl(thumbnailUrl)
                .rating(rating)
                .reviewCount(reviewCount)
                .status(restaurant.getStatus() != null ? restaurant.getStatus().name() : null)
                .placeId(restaurant.getPlace() != null ? restaurant.getPlace().getId() : null)
                .placeName(restaurant.getPlace() != null ? restaurant.getPlace().getName() : null)
                .ownerId(restaurant.getOwner() != null ? restaurant.getOwner().getId() : null)
                .ownerName(restaurant.getOwner() != null ? restaurant.getOwner().getFullName() : null)
                .createdAt(restaurant.getCreatedAt())
                .build();
    }
}
