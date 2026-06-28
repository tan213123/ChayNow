package com.teamg5.be.service.impl;

import com.teamg5.be.dto.PageResponseDTO;
import com.teamg5.be.dto.PostingResponse;
import com.teamg5.be.dto.UpdatePostingRequest;
import com.teamg5.be.entity.FoodCategory;
import com.teamg5.be.entity.Posting;
import com.teamg5.be.entity.Role;
import com.teamg5.be.entity.User;
import com.teamg5.be.exception.AppException;
import com.teamg5.be.exception.ErrorCode;
import com.teamg5.be.repository.PostingRepository;
import com.teamg5.be.repository.UserRepository;
import com.teamg5.be.service.PostingService;
import com.teamg5.be.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostingServiceImpl implements PostingService {

    private static final String IMAGE_URL_PATTERN =
            "^(https?|ftp|file)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]$";

    private final PostingRepository postingRepository;
    private final UserRepository userRepository;

    @Override
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

        String searchStatus = normalizeStatus(status);
        String searchKeyword = normalizeText(keyword);

        Page<Posting> dbPage;
        if (restaurantId != null) {
            dbPage = postingRepository.findByOwnerAndRestaurant(
                    currentUser.getId(),
                    restaurantId,
                    searchStatus,
                    searchKeyword,
                    pageable
            );
        } else {
            dbPage = postingRepository.findByOwner(
                    currentUser.getId(),
                    searchStatus,
                    searchKeyword,
                    pageable
            );
        }

        return toPageResponse(dbPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponseDTO<PostingResponse> getPublicPostings(
            String keyword,
            String categoryId,
            Long restaurantId,
            Long placeId,
            int page,
            int size
    ) {
        if (size > 50) size = 50;

        PageRequest pageable = PageRequest.of(page, size);
        Page<Posting> dbPage = postingRepository.findApprovedPublicPostings(
                normalizeCategory(categoryId),
                restaurantId,
                placeId,
                normalizeText(keyword),
                pageable
        );

        return toPageResponse(dbPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PostingResponse getPublicPostingDetail(Long postingId) {
        Posting posting = postingRepository.findApprovedById(postingId)
                .orElseThrow(() -> new AppException(ErrorCode.POSTING_NOT_FOUND));
        return mapToResponse(posting);
    }

    @Override
    @Transactional
    public PostingResponse updateMyPosting(Long postingId, UpdatePostingRequest request) {
        User currentUser = requireOwner();
        Posting posting = getOwnedPosting(postingId, currentUser);

        if ("APPROVED".equalsIgnoreCase(posting.getStatus())) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Approved posts cannot be edited directly");
        }

        if (!hasUpdatableField(request)) {
            throw new AppException(ErrorCode.INVALID_INPUT, "At least one field must be provided for update");
        }

        applyUpdate(posting, request);

        Posting saved = postingRepository.save(posting);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public void deleteMyPosting(Long postingId) {
        User currentUser = requireOwner();
        Posting posting = getOwnedPosting(postingId, currentUser);
        postingRepository.delete(posting);
    }

    @Override
    @Transactional
    public PostingResponse resubmitMyPosting(Long postingId) {
        User currentUser = requireOwner();
        Posting posting = getOwnedPosting(postingId, currentUser);

        if (!"REJECTED".equalsIgnoreCase(posting.getStatus())) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Only rejected posts can be resubmitted");
        }

        posting.setStatus("PENDING");
        posting.setRejectReason(null);
        posting.setApprovedBy(null);
        posting.setApprovedAt(null);
        posting.setRejectedAt(null);

        Posting saved = postingRepository.save(posting);
        return mapToResponse(saved);
    }

    private PageResponseDTO<PostingResponse> toPageResponse(Page<Posting> dbPage) {
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

    private Posting getOwnedPosting(Long postingId, User currentUser) {
        Posting posting = postingRepository.findById(postingId)
                .orElseThrow(() -> new AppException(ErrorCode.POSTING_NOT_FOUND));

        if (posting.getRestaurant() == null
                || posting.getRestaurant().getOwner() == null
                || posting.getRestaurant().getOwner().getId() == null
                || !posting.getRestaurant().getOwner().getId().equals(currentUser.getId())) {
            throw new AppException(ErrorCode.FORBIDDEN, "You do not own this posting");
        }

        return posting;
    }

    private User requireOwner() {
        User currentUser = getCurrentUser();
        if (currentUser.getRole() != Role.OWNER) {
            throw new AppException(ErrorCode.FORBIDDEN, "Only users with role OWNER can manage postings");
        }
        return currentUser;
    }

    private void applyUpdate(Posting posting, UpdatePostingRequest request) {
        if (StringUtils.hasText(request.getTitle())) {
            String title = request.getTitle().trim();
            if (title.length() < 2 || title.length() > 255) {
                throw new AppException(ErrorCode.INVALID_INPUT, "Title must be between 2 and 255 characters");
            }
            posting.setTitle(title);
        }

        if (StringUtils.hasText(request.getContent())) {
            String content = request.getContent().trim();
            if (content.length() < 10 || content.length() > 1000) {
                throw new AppException(ErrorCode.INVALID_INPUT, "Content must be between 10 and 1000 characters");
            }
            posting.setContent(content);
        }

        if (StringUtils.hasText(request.getCategory())) {
            posting.setCategory(normalizeCategory(request.getCategory()));
        }

        if (StringUtils.hasText(request.getImageUrl())) {
            String imageUrl = request.getImageUrl().trim();
            if (imageUrl.length() > 500 || !imageUrl.matches(IMAGE_URL_PATTERN)) {
                throw new AppException(ErrorCode.INVALID_INPUT, "Image URL must be a valid URL");
            }
            posting.setThumbnailUrl(imageUrl);
        }
    }

    private boolean hasUpdatableField(UpdatePostingRequest request) {
        return StringUtils.hasText(request.getTitle())
                || StringUtils.hasText(request.getContent())
                || StringUtils.hasText(request.getCategory())
                || StringUtils.hasText(request.getImageUrl());
    }

    private String normalizeStatus(String status) {
        return StringUtils.hasText(status) ? status.trim().toUpperCase() : null;
    }

    private String normalizeCategory(String category) {
        if (!StringUtils.hasText(category)) {
            return null;
        }

        String normalized = category.trim().toUpperCase();
        try {
            FoodCategory.valueOf(normalized);
        } catch (IllegalArgumentException ex) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Invalid food category: " + category);
        }
        return normalized;
    }

    private String normalizeText(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }

    private PostingResponse mapToResponse(Posting p) {
        String restaurantThumb = null;
        if (p.getRestaurant() != null
                && p.getRestaurant().getMediaList() != null
                && !p.getRestaurant().getMediaList().isEmpty()) {
            restaurantThumb = p.getRestaurant().getMediaList().get(0).getUrl();
        }

        return PostingResponse.builder()
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

                .authorId(p.getUser() != null ? p.getUser().getId() : null)
                .authorName(p.getUser() != null ? p.getUser().getFullName() : null)
                .authorAvatarUrl(p.getUser() != null ? p.getUser().getAvatarUrl() : null)

                .restaurantId(p.getRestaurant() != null ? p.getRestaurant().getId() : null)
                .restaurantName(p.getRestaurant() != null ? p.getRestaurant().getName() : null)
                .restaurantAddress(p.getRestaurant() != null ? p.getRestaurant().getAddress() : null)
                .restaurantPhone(p.getRestaurant() != null ? p.getRestaurant().getPhoneNumber() : null)
                .restaurantThumbnailUrl(restaurantThumb)

                .placeId(p.getRestaurant() != null && p.getRestaurant().getPlace() != null
                        ? p.getRestaurant().getPlace().getId() : null)
                .placeName(p.getRestaurant() != null && p.getRestaurant().getPlace() != null
                        ? p.getRestaurant().getPlace().getName() : null)
                .placeCity(p.getRestaurant() != null && p.getRestaurant().getPlace() != null
                        ? p.getRestaurant().getPlace().getCity() : null)

                .menuId(p.getMenu() != null ? p.getMenu().getId() : null)
                .menuName(p.getMenu() != null ? p.getMenu().getName() : null)
                .menuPrice(p.getMenu() != null ? p.getMenu().getPrice() : null)
                .build();
    }

    private User getCurrentUser() {
        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED));
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }
}
