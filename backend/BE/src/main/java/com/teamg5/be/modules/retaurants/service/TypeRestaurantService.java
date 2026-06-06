package com.teamg5.be.modules.retaurants.service;

import javax.management.RuntimeErrorException;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import com.teamg5.be.modules.retaurants.dto.request.CreateTypeRestaurantRequest;
import com.teamg5.be.modules.retaurants.dto.response.TypeRestaurantResponse;
import com.teamg5.be.modules.retaurants.entity.TypeRestaurant;
import com.teamg5.be.modules.retaurants.repository.TypeRestaurantRepository;
import com.teamg5.be.shared.exception.AppException;
import com.teamg5.be.shared.exception.ErrorCode;
import org.springframework.transaction.annotation.Transactional;
import  java.util.List;


@Service
@RequiredArgsConstructor
public class TypeRestaurantService {
    
    private final TypeRestaurantRepository typeRestaurantRepository;


    public TypeRestaurantResponse createdTypeRestaurant(CreateTypeRestaurantRequest request) {
        boolean existed = typeRestaurantRepository.existsByName(request.getName());

        if(existed) {
            throw new AppException(ErrorCode.TYPE_RESTAURANT_ALREADY_EXISTS);
        }

        TypeRestaurant typeRestaurant = TypeRestaurant.builder()
                        .name(request.getName())
                        .description(request.getDescription())
                        .build();
        
    TypeRestaurant saveTypeRestaurant = typeRestaurantRepository.save(typeRestaurant);
    return TypeRestaurantResponse.from(saveTypeRestaurant);
    }

    @Transactional(readOnly = true)
    public List<TypeRestaurantResponse> getAllTypeRestaurant() {
        return typeRestaurantRepository.findAll()
                .stream()
                .map(TypeRestaurantResponse::from)
                .toList();
    }
    @Transactional(readOnly = true)
    public TypeRestaurantResponse getTypeRestaurantById(Long typeRestaurantId) {
        TypeRestaurant typeRestaurant = typeRestaurantRepository.findById(typeRestaurantId)
                .orElseThrow(() -> new AppException(ErrorCode.TYPE_RESTAURANT_NOT_FOUND));

        return TypeRestaurantResponse.from(typeRestaurant);
    }
}
