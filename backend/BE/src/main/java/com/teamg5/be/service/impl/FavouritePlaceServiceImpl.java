package com.teamg5.be.service.impl;

import com.teamg5.be.dto.PageResponse;
import com.teamg5.be.dto.FavouritePlaceResponse;
import com.teamg5.be.dto.RestaurantResponse;
import com.teamg5.be.entity.FavouritePlace;
import com.teamg5.be.entity.Restaurant;
import com.teamg5.be.entity.RestaurantStatus;
import com.teamg5.be.entity.User;
import com.teamg5.be.exception.AppException;
import com.teamg5.be.exception.ErrorCode;
import com.teamg5.be.repository.FavouritePlaceRepository;
import com.teamg5.be.repository.RestaurantRepository;
import com.teamg5.be.repository.UserRepository;
import com.teamg5.be.service.FavouritePlaceService;
import com.teamg5.be.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class FavouritePlaceServiceImpl implements FavouritePlaceService {

    private final FavouritePlaceRepository favouritePlaceRepository;
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;

    @Override
    @Transactional
    public void addFavourite(Long restaurantId) {
        User currentUser = getCurrentUser();
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new AppException(ErrorCode.RESTAURANT_NOT_FOUND));

        if (!Boolean.TRUE.equals(restaurant.getActive()) || restaurant.getStatus() != RestaurantStatus.APPROVED) {
            throw new AppException(ErrorCode.RESTAURANT_NOT_FOUND, "Nhà hàng này chưa hoạt động hoặc chưa được duyệt");
        }

        boolean exists = favouritePlaceRepository.existsByUserAndRestaurantId(currentUser, restaurantId);
        if (!exists) {
            FavouritePlace favouritePlace = FavouritePlace.builder()
                    .user(currentUser)
                    .restaurant(restaurant)
                    .build();
            favouritePlaceRepository.save(favouritePlace);
        }
    }

    @Override
    @Transactional
    public void removeFavourite(Long restaurantId) {
        User currentUser = getCurrentUser();
        
        // Check if restaurant exists
        if (!restaurantRepository.existsById(restaurantId)) {
            throw new AppException(ErrorCode.RESTAURANT_NOT_FOUND);
        }

        favouritePlaceRepository.findByUserAndRestaurantId(currentUser, restaurantId)
                .ifPresent(favouritePlaceRepository::delete);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<FavouritePlaceResponse> getMyFavourites(int page, int size) {
        User currentUser = getCurrentUser();
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        Page<FavouritePlace> dbPage = favouritePlaceRepository.findByUser(currentUser, pageable);

        List<FavouritePlaceResponse> content = dbPage.getContent().stream()
                .map(favouritePlace -> FavouritePlaceResponse.builder()
                        .id(favouritePlace.getId())
                        .restaurant(RestaurantResponse.from(favouritePlace.getRestaurant()))
                        .createdAt(favouritePlace.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return PageResponse.<FavouritePlaceResponse>builder()
                .content(content)
                .page(dbPage.getNumber())
                .size(dbPage.getSize())
                .totalElements(dbPage.getTotalElements())
                .totalPages(dbPage.getTotalPages())
                .last(dbPage.isLast())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isFavourite(Long restaurantId) {
        User currentUser = getCurrentUser();
        
        // Check if restaurant exists
        if (!restaurantRepository.existsById(restaurantId)) {
            throw new AppException(ErrorCode.RESTAURANT_NOT_FOUND);
        }

        return favouritePlaceRepository.existsByUserAndRestaurantId(currentUser, restaurantId);
    }

    private User getCurrentUser() {
        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED));
        if (email.equals("anonymousUser")) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }
}
