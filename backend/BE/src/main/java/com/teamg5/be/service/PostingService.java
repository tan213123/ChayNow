package com.teamg5.be.service;

import com.teamg5.be.dto.PageResponseDTO;
import com.teamg5.be.dto.PostingResponse;
import com.teamg5.be.entity.Posting;
import com.teamg5.be.entity.User;
import com.teamg5.be.exception.AppException;
import com.teamg5.be.exception.ErrorCode;
import com.teamg5.be.repository.PostingRepository;
import com.teamg5.be.repository.UserRepository;
import com.teamg5.be.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostingService {

    private final PostingRepository postingRepository;
    private final UserRepository userRepository;

    /**
     * Lấy danh sách bài đăng của owner đang đăng nhập.
     * Hỗ trợ lọc theo status, tìm kiếm theo từ khóa, lọc theo nhà hàng cụ thể.
     */
    @Transactional(readOnly = true)
    public PageResponseDTO<PostingResponse> getMyPostings(
            String status,
            String keyword,
            Long restaurantId,
            int page,
            int size
    ) {
        if (size > 50) size = 50;

        User currentUser = getCurrentUser();
        PageRequest pageable = PageRequest.of(page, size);

        Page<Posting> dbPage;
        if (restaurantId != null) {
            dbPage = postingRepository.findByOwnerAndRestaurant(
                    currentUser.getId(), restaurantId,
                    (status != null && !status.isBlank()) ? status.trim().toUpperCase() : null,
                    pageable
            );
        } else {
            dbPage = postingRepository.findByOwner(
                    currentUser.getId(),
                    (status != null && !status.isBlank()) ? status.trim().toUpperCase() : null,
                    (keyword != null && !keyword.isBlank()) ? keyword.trim() : null,
                    pageable
            );
        }

        List<PostingResponse> content = dbPage.getContent().stream()
                .map(this::mapToResponse)
                .toList();

        return PageResponseDTO.<PostingResponse>builder()
                .content(content)
                .page(dbPage.getNumber())
                .size(dbPage.getSize())
                .totalElements(dbPage.getTotalElements())
                .totalPages(dbPage.getTotalPages())
                .last(dbPage.isLast())
                .build();
    }

    // ===================== HELPERS =====================

    private User getCurrentUser() {
        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED));
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    private PostingResponse mapToResponse(Posting p) {
        // Ảnh đại diện nhà hàng: lấy ảnh đầu tiên trong mediaList
        String restaurantThumb = null;
        if (p.getRestaurant() != null
                && p.getRestaurant().getMediaList() != null
                && !p.getRestaurant().getMediaList().isEmpty()) {
            restaurantThumb = p.getRestaurant().getMediaList().get(0).getUrl();
        }

        return PostingResponse.builder()
                // Bài đăng
                .id(p.getId())
                .title(p.getTitle())
                .content(p.getContent())
                .category(p.getCategory())
                .thumbnailUrl(p.getThumbnailUrl())
                .likeCount(p.getLikeCount())
                .commentCount(p.getCommentCount())
                .status(p.getStatus())
                .rejectReason(p.getRejectReason())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())

                // Tác giả
                .authorId(p.getUser() != null ? p.getUser().getId() : null)
                .authorName(p.getUser() != null ? p.getUser().getFullName() : null)
                .authorAvatarUrl(p.getUser() != null ? p.getUser().getAvatarUrl() : null)

                // Nhà hàng
                .restaurantId(p.getRestaurant() != null ? p.getRestaurant().getId() : null)
                .restaurantName(p.getRestaurant() != null ? p.getRestaurant().getName() : null)
                .restaurantAddress(p.getRestaurant() != null ? p.getRestaurant().getAddress() : null)
                .restaurantPhone(p.getRestaurant() != null ? p.getRestaurant().getPhoneNumber() : null)
                .restaurantThumbnailUrl(restaurantThumb)

                // Khu vực
                .placeId(p.getRestaurant() != null && p.getRestaurant().getPlace() != null
                        ? p.getRestaurant().getPlace().getId() : null)
                .placeName(p.getRestaurant() != null && p.getRestaurant().getPlace() != null
                        ? p.getRestaurant().getPlace().getName() : null)
                .placeCity(p.getRestaurant() != null && p.getRestaurant().getPlace() != null
                        ? p.getRestaurant().getPlace().getCity() : null)

                // Menu đính kèm
                .menuId(p.getMenu() != null ? p.getMenu().getId() : null)
                .menuName(p.getMenu() != null ? p.getMenu().getName() : null)
                .menuPrice(p.getMenu() != null ? p.getMenu().getPrice() : null)

                .build();
    }
}
