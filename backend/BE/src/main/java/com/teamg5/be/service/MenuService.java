package com.teamg5.be.service;


import com.teamg5.be.dto.CreateMenuRequest;
import com.teamg5.be.dto.MenuResponse;
import com.teamg5.be.dto.UpdateMenuRequest;
import com.teamg5.be.entity.Menu;
import com.teamg5.be.entity.Restaurant;
import com.teamg5.be.exception.AppException;
import com.teamg5.be.exception.ErrorCode;
import com.teamg5.be.repository.MenuRepository;
import com.teamg5.be.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;



@Service
@RequiredArgsConstructor
@Transactional
public class MenuService {
    
    private final MenuRepository menuRepository;
    private final RestaurantRepository restaurantRepository;

    // create
     public MenuResponse createMenu(
            Long restaurantId,
            CreateMenuRequest request
    ) {
        Restaurant restaurant = restaurantRepository
                .findByIdAndActiveTrue(restaurantId)
                .orElseThrow(() ->
                        new AppException(ErrorCode.RESTAURANT_NOT_FOUND)
                );

        Menu menu = Menu.builder()
                .restaurant(restaurant)
                .name(request.getName().trim())
                .description(trimToNull(request.getDescription()))
                .price(request.getPrice())
                .category(trimToNull(request.getCategory()))
                .imageUrl(trimToNull(request.getImageUrl()))
                .available(
                        request.getAvailable() != null
                                ? request.getAvailable()
                                : true
                )
                .featured(
                        request.getFeatured() != null
                                ? request.getFeatured()
                                : false
                )
                .active(true)
                .build();

        Menu savedMenu = menuRepository.save(menu);

        return MenuResponse.from(savedMenu);
    }
    //get one 
    @Transactional(readOnly = true)
    public MenuResponse getMenuById(Long menuId) {
        Menu menu = menuRepository.findByIdAndActiveTrue(menuId)
                .orElseThrow(() ->
                        new AppException(ErrorCode.MENU_NOT_FOUND)
                );

        return MenuResponse.from(menu);
    }

    // get all menu
    @Transactional(readOnly = true)
    public List<MenuResponse> getAllMenus() {
        return menuRepository.findAllByActiveTrue()
                .stream()
                .map(MenuResponse::from)
                .toList();
    }

    // get menu by restaurant

     @Transactional(readOnly = true)
    public List<MenuResponse> getMenusByRestaurant(
            Long restaurantId
    ) {
        restaurantRepository.findByIdAndActiveTrue(restaurantId)
                .orElseThrow(() ->
                        new AppException(ErrorCode.RESTAURANT_NOT_FOUND)
                );

        return menuRepository
                .findByRestaurant_IdAndActiveTrue(restaurantId)
                .stream()
                .map(MenuResponse::from)
                .toList();
    }
    // update 
    public MenuResponse updateMenu(
            Long menuId,
            UpdateMenuRequest request
    ) {
        Menu menu = menuRepository.findByIdAndActiveTrue(menuId)
                .orElseThrow(() ->
                        new AppException(ErrorCode.MENU_NOT_FOUND)
                );

        if (StringUtils.hasText(request.getName())) {
            menu.setName(request.getName().trim());
        }

        if (StringUtils.hasText(request.getDescription())) {
            menu.setDescription(request.getDescription().trim());
        }

        if (request.getPrice() != null) {
            menu.setPrice(request.getPrice());
        }

        if (StringUtils.hasText(request.getCategory())) {
            menu.setCategory(request.getCategory().trim());
        }

        if (StringUtils.hasText(request.getImageUrl())) {
            menu.setImageUrl(request.getImageUrl().trim());
        }

        if (request.getAvailable() != null) {
            menu.setAvailable(request.getAvailable());
        }

        if (request.getFeatured() != null) {
            menu.setFeatured(request.getFeatured());
        }

        Menu savedMenu = menuRepository.save(menu);

        return MenuResponse.from(savedMenu);
    }

     public void softDeleteMenu(Long menuId) {
        Menu menu = menuRepository.findByIdAndActiveTrue(menuId)
                .orElseThrow(() ->
                        new AppException(ErrorCode.MENU_NOT_FOUND)
                );

        menu.setActive(!menu.getActive());
        menu.setAvailable(!menu.getAvailable());
        menu.setFeatured(!menu.getFeatured());

        menuRepository.save(menu);
    }
    private String trimToNull(String value) {
    return StringUtils.hasText(value)
            ? value.trim()
            : null;
    }
}

