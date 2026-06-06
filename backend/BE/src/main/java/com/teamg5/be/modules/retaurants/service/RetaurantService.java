package com.teamg5.be.modules.retaurants.service;

import com.teamg5.be.modules.retaurants.dto.request.CreateRestaurantRequest;
import com.teamg5.be.modules.retaurants.dto.response.RestaurantResponse;
import com.teamg5.be.modules.retaurants.dto.response.TypeRestaurantResponse;
import com.teamg5.be.modules.retaurants.repository.RestaurantRepository;
import com.teamg5.be.modules.retaurants.repository.TypeRestaurantRepository;
import com.teamg5.be.shared.exception.AppException;
import com.teamg5.be.shared.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

import com.teamg5.be.modules.retaurants.entity.TypeRestaurant;
import com.teamg5.be.modules.retaurants.entity.Media;
import com.teamg5.be.modules.retaurants.entity.Mediatype;
import com.teamg5.be.modules.retaurants.entity.Restaurant;
import  java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service
@RequiredArgsConstructor
@Transactional
public class RetaurantService {
    
    private final RestaurantRepository restaurantRepository;
    private final TypeRestaurantRepository typeRestaurantRepository;

    public RestaurantResponse createdRestaurant(CreateRestaurantRequest request) {
        TypeRestaurant typeRestaurant = typeRestaurantRepository.findById(request.getTypeRestaurantId())
                        .orElseThrow(() -> new AppException(ErrorCode.TYPE_RESTAURANT_NOT_FOUND));

                        Restaurant restaurant = Restaurant.builder()
                                            .name(request.getName())
                                            .address(request.getAddress())
                                            .phoneNumber(request.getPhoneNumber())
                                            .description(request.getDescription())
                                            .typeRestaurant(typeRestaurant)
                                            .build();
        
        if(request.getMediaUrls() != null && !request.getMediaUrls().isEmpty()) {
            request.getMediaUrls().forEach(url -> {
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

    @Transactional(readOnly = true)
    public RestaurantResponse getRestaurantById(Long restaurantId) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new AppException(ErrorCode.RESTAURANT_NOT_FOUND));

        return RestaurantResponse.from(restaurant);
    }

    @Transactional(readOnly = true)
    public List<RestaurantResponse> getAllRestaurant() {
        return restaurantRepository.findAll()
                .stream()
                .map(RestaurantResponse::from)
                .toList();
    }



}
