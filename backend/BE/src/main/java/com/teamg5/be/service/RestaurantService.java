package com.teamg5.be.service;

import com.teamg5.be.dto.CreateRestaurantRequest;
import com.teamg5.be.dto.MediaResponse;
import com.teamg5.be.dto.RestaurantResponse;
import com.teamg5.be.dto.TypeRestaurantResponse;
import com.teamg5.be.dto.UpdateRestaurantRequest;
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

        Restaurant restaurant = Restaurant.builder()
                .name(request.getName().trim())
                .address(request.getAddress())
                .phoneNumber(request.getPhoneNumber())
                .description(request.getDescription())
                .openTime(request.getOpenTime())
                .closedTime(request.getClosedTime())
                .owner(currentUser)
                .typeRestaurant(typeRestaurant)
                .place(place)
                .active(true)
                .build();

        if (request.getMediaUrls() != null) {
            request.getMediaUrls()
                    .stream()
                    .filter(StringUtils::hasText)
                    .map(String::trim)
                    .forEach(url -> {
                        Media media = Media.builder()
                                .url(url)
                                .type(Mediatype.IMAGE)
                                .restaurant(restaurant)
                                .build();

                        restaurant.getMediaList().add(media);
                    });
        }

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
        restaurant.setName(request.getName());
    }

    if (StringUtils.hasText(request.getAddress())) {
        restaurant.setAddress(request.getAddress());
    }

    if (StringUtils.hasText(request.getPhoneNumber())) {
        restaurant.setPhoneNumber(request.getPhoneNumber());
    }

    if (StringUtils.hasText(request.getDescription())) {
        restaurant.setDescription(request.getDescription());
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
    if(request.getOpenTime() != null) {
        restaurant.setOpenTime(request.getOpenTime());
    }
    if(request.getClosedTime() != null){
        restaurant.setClosedTime(request.getClosedTime());
    }

    if(request.getMediaUrls() != null) {
        restaurant.getMediaList().clear();

        request.getMediaUrls().stream()
                .filter(StringUtils::hasText)
                .map(String::trim)
                .forEach(url -> {
                    Media media = Media.builder()
                            .url(url)
                            .type(Mediatype.IMAGE)
                            .restaurant(restaurant)
                            .build();

                    restaurant.getMediaList().add(media);
                });
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
