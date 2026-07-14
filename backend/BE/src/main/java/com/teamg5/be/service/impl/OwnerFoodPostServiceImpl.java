package com.teamg5.be.service.impl;

import com.teamg5.be.dto.CreateFoodPostRequest;
import com.teamg5.be.dto.FoodPostResponse;
import com.teamg5.be.entity.FoodCategory;
import com.teamg5.be.entity.NotificationType;
import com.teamg5.be.entity.Posting;
import com.teamg5.be.entity.Restaurant;
import com.teamg5.be.entity.RestaurantStatus;
import com.teamg5.be.entity.Role;
import com.teamg5.be.entity.User;
import com.teamg5.be.event.SystemNotificationEvent;
import com.teamg5.be.exception.AppException;
import com.teamg5.be.exception.ErrorCode;
import com.teamg5.be.repository.PostingRepository;
import com.teamg5.be.repository.RestaurantRepository;
import com.teamg5.be.repository.UserRepository;
import com.teamg5.be.service.OwnerFoodPostService;
import com.teamg5.be.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class OwnerFoodPostServiceImpl implements OwnerFoodPostService {

    private final PostingRepository postingRepository;
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    public FoodPostResponse createFoodPost(CreateFoodPostRequest request) {
        User currentUser = getCurrentUser();

        // 1. Verify role is OWNER
        if (currentUser.getRole() != Role.OWNER) {
            throw new AppException(ErrorCode.FORBIDDEN, "Chỉ người dùng có vai trò CHỦ QUÁN mới có thể đăng bài chia sẻ món ăn");
        }

        // 2. Fetch and check restaurant exists
        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                .orElseThrow(() -> new AppException(ErrorCode.RESTAURANT_NOT_FOUND, "Không tìm thấy nhà hàng với mã ID: " + request.getRestaurantId()));

        // 3. Verify ownership
        if (restaurant.getOwner() == null || !restaurant.getOwner().getId().equals(currentUser.getId())) {
            throw new AppException(ErrorCode.FORBIDDEN, "Bạn không sở hữu nhà hàng này");
        }

        // 4. Verify restaurant is active and not rejected
        if (!Boolean.TRUE.equals(restaurant.getActive()) || restaurant.getStatus() == RestaurantStatus.REJECTED) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Nhà hàng không hoạt động hoặc đã bị từ chối");
        }

        // 5. Validate category is valid FoodCategory
        String categoryStr = request.getCategory().trim().toUpperCase();
        try {
            FoodCategory.valueOf(categoryStr);
        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Danh mục món ăn không hợp lệ: " + request.getCategory());
        }

        // 6. Create posting
        Posting posting = Posting.builder()
                .user(currentUser)
                .restaurant(restaurant)
                .title(request.getName().trim())
                .content(request.getDescription().trim())
                .category(categoryStr)
                .thumbnailUrl(request.getImageUrl().trim())
                .status("PENDING") // moderation default
                .build();

        Posting saved = postingRepository.save(posting);
        notifyAdminsAboutFoodPost(saved);
        return FoodPostResponse.from(saved);
    }

    private void notifyAdminsAboutFoodPost(Posting posting) {
        String authorName = posting.getUser() != null ? posting.getUser().getFullName() : "Chu quan";
        userRepository.findByRole(Role.ADMIN).forEach(admin ->
                eventPublisher.publishEvent(new SystemNotificationEvent(
                        admin,
                        "Bai dang mon an moi can duyet",
                        authorName + " vua gui bai dang \"" + posting.getTitle() + "\".",
                        NotificationType.NEW_POST,
                        posting.getId().toString()
                ))
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, String>> getFoodCategories() {
        List<Map<String, String>> categories = new ArrayList<>();
        
        categories.add(createCategoryMap(FoodCategory.MAIN_DISH.name(), "Món chính"));
        categories.add(createCategoryMap(FoodCategory.APPETIZER.name(), "Món khai vị"));
        categories.add(createCategoryMap(FoodCategory.DRINK.name(), "Đồ uống"));
        categories.add(createCategoryMap(FoodCategory.DESSERT.name(), "Tráng miệng"));
        categories.add(createCategoryMap(FoodCategory.OTHER.name(), "Khác"));
        
        return categories;
    }

    private Map<String, String> createCategoryMap(String value, String label) {
        Map<String, String> map = new LinkedHashMap<>();
        map.put("value", value);
        map.put("label", label);
        return map;
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
}
