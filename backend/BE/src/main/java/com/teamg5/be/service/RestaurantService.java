package com.teamg5.be.service;

import com.teamg5.be.dto.CreateRestaurantRequest;
import com.teamg5.be.dto.MediaResponse;
import com.teamg5.be.dto.RestaurantResponse;
import com.teamg5.be.dto.TypeRestaurantResponse;
import com.teamg5.be.dto.UpdateRestaurantRequest;
import com.teamg5.be.repository.MediaRepository;
import com.teamg5.be.repository.PlaceRepository;
import com.teamg5.be.repository.RestaurantRepository;
import com.teamg5.be.repository.TypeRestaurantRepository;
import com.teamg5.be.repository.UserRepository;
import com.teamg5.be.exception.AppException;
import com.teamg5.be.exception.ErrorCode;

import lombok.RequiredArgsConstructor;
import org.springframework.util.StringUtils;
import com.teamg5.be.entity.TypeRestaurant;
import com.teamg5.be.entity.User;
import com.teamg5.be.entity.Media;
import com.teamg5.be.entity.Mediatype;
import com.teamg5.be.entity.Place;
import com.teamg5.be.entity.Restaurant;

import java.time.LocalDate;
import java.time.LocalTime;
import  java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service
@RequiredArgsConstructor
@Transactional
public class RestaurantService {
    
    private final RestaurantRepository restaurantRepository;
    private final TypeRestaurantRepository typeRestaurantRepository;
    private final PlaceRepository placeRepository;
    private final UserRepository userRepository;
    private final MediaRepository mediaRepository;

    private List<MediaResponse> mediaList;

    public RestaurantResponse createdRestaurant(CreateRestaurantRequest request) {
        User currentUser = getCurrentUser();

        TypeRestaurant typeRestaurant = typeRestaurantRepository
                .findById(request.getTypeRestaurantId())
                .orElseThrow(() ->
                        new AppException(
                                ErrorCode.TYPE_RESTAURANT_NOT_FOUND
                        )
                );

        Place place = placeRepository
                .findByIdAndActiveTrue(request.getPlaceId())
                .orElseThrow(() ->
                        new AppException(ErrorCode.PLACE_NOT_FOUND)
                );

        if (request.getOpenTime() != null && request.getClosedTime() != null) {
            if (!request.getOpenTime().isBefore(request.getClosedTime())) {
                throw new AppException(ErrorCode.INVALID_INPUT, "Giờ mở cửa phải trước giờ đóng cửa.");
            }
        }

        Restaurant restaurant = Restaurant.builder()
                .name(request.getName() != null ? request.getName().trim() : null)
                .address(request.getAddress() != null ? request.getAddress().trim() : null)
                .phoneNumber(request.getPhoneNumber() != null ? request.getPhoneNumber().trim() : null)
                .description(request.getDescription() != null ? request.getDescription().trim() : null)
                .openTime(request.getOpenTime())
                .closedTime(request.getClosedTime())
                .owner(currentUser)
                .typeRestaurant(typeRestaurant)
                .place(place)
                .active(true)
                .build();
        Restaurant savedRestaurant =
                restaurantRepository.save(restaurant);

        return RestaurantResponse.from(savedRestaurant);

    }

    @Transactional(readOnly = true)
    public RestaurantResponse getRestaurantById(Long restaurantId) {
        Restaurant restaurant = restaurantRepository.findByIdAndActiveTrue(restaurantId)
                .orElseThrow(() -> new AppException(ErrorCode.RESTAURANT_NOT_FOUND));

        return RestaurantResponse.from(restaurant);
    }

    @Transactional(readOnly = true)
    public List<RestaurantResponse> getAllRestaurant() {
        return restaurantRepository.findAllByActiveTrue()
                .stream()
                .map(RestaurantResponse::from)
                .toList();
    }
    public RestaurantResponse updateResponse(Long restaurantId , UpdateRestaurantRequest request) {
         Restaurant restaurant = restaurantRepository.findById(restaurantId)
            .orElseThrow(() -> new AppException(ErrorCode.RESTAURANT_NOT_FOUND));

    if (StringUtils.hasText(request.getName())) {
        restaurant.setName(request.getName().trim());
    }

    if (StringUtils.hasText(request.getAddress())) {
        restaurant.setAddress(request.getAddress().trim());
    }

    if (StringUtils.hasText(request.getPhoneNumber())) {
        restaurant.setPhoneNumber(request.getPhoneNumber().trim());
    }

    if (StringUtils.hasText(request.getDescription())) {
        restaurant.setDescription(request.getDescription().trim());
    }
    

    if (request.getTypeRestaurantId() != null) {
        TypeRestaurant typeRestaurant = typeRestaurantRepository.findById(request.getTypeRestaurantId())
                .orElseThrow(() -> new AppException(ErrorCode.TYPE_RESTAURANT_NOT_FOUND));

        restaurant.setTypeRestaurant(typeRestaurant);
    }

    if(request.getPlaceId() != null ) {
        Place place = placeRepository.findById(request.getPlaceId())
                    .orElseThrow(() -> new AppException(ErrorCode.PLACE_NOT_FOUND));
                    restaurant.setPlace(place);
    }

    LocalTime openTime = request.getOpenTime() != null ? request.getOpenTime() : restaurant.getOpenTime();
    LocalTime closedTime = request.getClosedTime() != null ? request.getClosedTime() : restaurant.getClosedTime();
    if (openTime != null && closedTime != null && !openTime.isBefore(closedTime)) {
        throw new AppException(ErrorCode.INVALID_INPUT, "Giờ mở cửa phải trước giờ đóng cửa.");
    }

    if(request.getOpenTime() != null) {
        restaurant.setOpenTime(request.getOpenTime());
    }
    if(request.getClosedTime() != null){
        restaurant.setClosedTime(request.getClosedTime());
    }

    if (request.getMediaIds() != null) {
        restaurant.getMediaList().clear();
        if (!request.getMediaIds().isEmpty()) {
            List<Media> existingMedia = mediaRepository.findAllById(request.getMediaIds());
            for (Media media : existingMedia) {
                media.setRestaurant(restaurant);
                restaurant.getMediaList().add(media);
            }
        }
    }
    Restaurant savedRestaurant = restaurantRepository.save(restaurant);

    return RestaurantResponse.from(savedRestaurant);
    }
    //delete
     public void softDeleteRestaurant(Long restaurantId){
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                            .orElseThrow(() -> new AppException(ErrorCode.RESTAURANT_NOT_FOUND));

        restaurant.setActive(!restaurant.getActive());
        restaurantRepository.save(restaurant);
     }

     // hàm lấy các nhà hàng của user hiện tại
     @Transactional(readOnly = true)
    public List<RestaurantResponse> getMyRestaurants() {
        User currentUser = getCurrentUser();

        return restaurantRepository
                .findAllByOwner_IdAndActiveTrue(currentUser.getId())
                .stream()
                .map(RestaurantResponse::from)
                .toList();
        }

    // admin lấy nhà hàng của một user theo id
    @Transactional(readOnly = true)
    public List<RestaurantResponse> getRestaurantsByUserId(
            Long userId
    ) {
        userRepository.findById(userId)
                .orElseThrow(() ->
                        new AppException(ErrorCode.USER_NOT_FOUND)
                );

        return restaurantRepository
                .findAllByOwner_IdAndActiveTrue(userId)
                .stream()
                .map(RestaurantResponse::from)
                .toList();
    }

     // lấy thông tin người dùng
     private User getCurrentUser() {
    Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

    if (authentication == null
            || !authentication.isAuthenticated()) {
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
            .orElseThrow(() ->
                    new AppException(ErrorCode.USER_NOT_FOUND)
            );
        }

}
