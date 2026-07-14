package com.teamg5.be.service;

import com.teamg5.be.dto.PageResponse;
import com.teamg5.be.dto.RestaurantResponse;
import com.teamg5.be.dto.FavouritePlaceResponse;

public interface FavouritePlaceService {
    void addFavourite(Long restaurantId);
    void removeFavourite(Long restaurantId);
    PageResponse<FavouritePlaceResponse> getMyFavourites(int page, int size);
    boolean isFavourite(Long restaurantId);
}
