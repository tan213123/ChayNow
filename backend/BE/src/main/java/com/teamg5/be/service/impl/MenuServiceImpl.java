package com.teamg5.be.service.impl;

import com.teamg5.be.dto.CreateMenuRequest;
import com.teamg5.be.dto.MenuResponse;
import com.teamg5.be.dto.UpdateMenuRequest;
import com.teamg5.be.entity.Menu;
import com.teamg5.be.entity.Restaurant;
import com.teamg5.be.entity.Role;
import com.teamg5.be.entity.User;
import com.teamg5.be.exception.AppException;
import com.teamg5.be.exception.ErrorCode;
import com.teamg5.be.repository.MenuRepository;
import com.teamg5.be.repository.RestaurantRepository;
import com.teamg5.be.repository.UserRepository;
import com.teamg5.be.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import com.teamg5.be.entity.Role;
import com.teamg5.be.entity.NotificationType;
import com.teamg5.be.event.SystemNotificationEvent;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MenuServiceImpl implements MenuService {
    
    private final MenuRepository menuRepository;
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;

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

    private void verifyOwnerOrAdmin(Restaurant restaurant) {
        User currentUser = getCurrentUser();
        if (currentUser.getRole() != Role.ADMIN) {
            if (restaurant.getOwner() == null || !restaurant.getOwner().getId().equals(currentUser.getId())) {
                throw new AppException(ErrorCode.FORBIDDEN);
            }
        }
    }

    @Override
    public MenuResponse createMenu(Long restaurantId, CreateMenuRequest request) {
        Restaurant restaurant = restaurantRepository
                .findByIdAndActiveTrue(restaurantId)
                .orElseThrow(() ->
                        new AppException(ErrorCode.RESTAURANT_NOT_FOUND)
                );

        verifyOwnerOrAdmin(restaurant);

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

        // Notify all standard customers of the new dish
        try {
            List<User> customers = userRepository.findByRole(Role.USER);
            for (User customer : customers) {
                eventPublisher.publishEvent(new SystemNotificationEvent(
                        customer,
                        "Món ăn mới tại " + restaurant.getName(),
                        "Nhà hàng '" + restaurant.getName() + "' vừa thêm món mới vào thực đơn: '" + savedMenu.getName() + "'",
                        NotificationType.NEW_DISH,
                        restaurant.getId().toString()
                ));
            }
        } catch (Exception e) {
            // Log but don't fail transaction
        }

        return MenuResponse.from(savedMenu);
    }

    @Override
    @Transactional(readOnly = true)
    public MenuResponse getMenuById(Long menuId) {
        Menu menu = menuRepository.findByIdAndActiveTrue(menuId)
                .orElseThrow(() ->
                        new AppException(ErrorCode.MENU_NOT_FOUND)
                );

        return MenuResponse.from(menu);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MenuResponse> getAllMenus() {
        return menuRepository.findAllByActiveTrue()
                .stream()
                .map(MenuResponse::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MenuResponse> getMenusByRestaurant(Long restaurantId) {
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

    @Override
    public MenuResponse updateMenu(Long menuId, UpdateMenuRequest request) {
        Menu menu = menuRepository.findByIdAndActiveTrue(menuId)
                .orElseThrow(() ->
                        new AppException(ErrorCode.MENU_NOT_FOUND)
                );

        verifyOwnerOrAdmin(menu.getRestaurant());

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

    @Override
    public void softDeleteMenu(Long menuId) {
        Menu menu = menuRepository.findByIdAndActiveTrue(menuId)
                .orElseThrow(() ->
                        new AppException(ErrorCode.MENU_NOT_FOUND)
                );

        verifyOwnerOrAdmin(menu.getRestaurant());

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
