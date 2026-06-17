package com.teamg5.be.service.impl;

import com.teamg5.be.dto.*;
import com.teamg5.be.entity.Posting;
import com.teamg5.be.entity.User;
import com.teamg5.be.exception.AppException;
import com.teamg5.be.exception.ErrorCode;
import com.teamg5.be.repository.PostingRepository;
import com.teamg5.be.repository.UserRepository;
import com.teamg5.be.service.AdminFoodPostService;
import com.teamg5.be.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminFoodPostServiceImpl implements AdminFoodPostService {

    private final PostingRepository postingRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public AdminFoodPostListResponse getFoodPosts(AdminFoodPostListRequest request) {
        verifyAdmin();

        int size = request.getSize();
        if (size > 50) size = 50;

        String sortField = "createdAt";
        if ("likesCount".equals(request.getSortBy())) {
            sortField = "likeCount";
        } else if ("title".equals(request.getSortBy())) {
            sortField = "title";
        }

        Sort.Direction direction = Sort.Direction.DESC;
        if ("asc".equalsIgnoreCase(request.getSortDir())) {
            direction = Sort.Direction.ASC;
        }

        Sort sort = Sort.by(direction, sortField);
        Pageable pageable = PageRequest.of(request.getPage(), size, sort);

        String searchKeyword = (request.getKeyword() != null && !request.getKeyword().isBlank())
                ? request.getKeyword().trim() : null;
        String searchStatus = (request.getStatus() != null && !request.getStatus().isBlank())
                ? request.getStatus().trim().toUpperCase() : null;
        String searchCategory = (request.getCategoryId() != null && !request.getCategoryId().isBlank())
                ? request.getCategoryId().trim() : null;

        Page<Posting> dbPage = postingRepository.findAllFoodPosts(
                searchStatus, searchCategory, request.getMinLikes(), searchKeyword, pageable
        );

        List<AdminFoodPostListItemResponse> dataList = dbPage.getContent().stream()
                .map(this::mapToListItemResponse)
                .toList();

        return AdminFoodPostListResponse.builder()
                .data(dataList)
                .pagination(AdminFoodPostListResponse.PaginationInfo.builder()
                        .page(dbPage.getNumber())
                        .size(dbPage.getSize())
                        .totalItems(dbPage.getTotalElements())
                        .totalPages(dbPage.getTotalPages())
                        .build())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AdminFoodPostDetailResponse getFoodPostDetail(Long postId) {
        verifyAdmin();

        Posting posting = postingRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POSTING_NOT_FOUND));

        return mapToDetailResponse(posting);
    }

    @Override
    @Transactional
    public FoodPostActionResponse approveFoodPost(Long postId, ApproveFoodPostRequest request) {
        verifyAdmin();

        Posting posting = postingRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POSTING_NOT_FOUND));

        if (!"PENDING".equalsIgnoreCase(posting.getStatus()) && !"REJECTED".equalsIgnoreCase(posting.getStatus())) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Only pending or rejected posts can be approved");
        }

        User currentUser = getCurrentUser();

        posting.setStatus("APPROVED");
        posting.setApprovedBy(currentUser);
        posting.setApprovedAt(LocalDateTime.now());
        posting.setRejectedAt(null);
        posting.setRejectReason(null);

        Posting saved = postingRepository.save(posting);

        return FoodPostActionResponse.builder()
                .id(saved.getId().toString())
                .status("APPROVED")
                .approvedAt(saved.getApprovedAt())
                .message("Food post approved successfully")
                .build();
    }

    @Override
    @Transactional
    public FoodPostActionResponse rejectFoodPost(Long postId, RejectFoodPostRequest request) {
        verifyAdmin();

        Posting posting = postingRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POSTING_NOT_FOUND));

        if (!"PENDING".equalsIgnoreCase(posting.getStatus()) && !"APPROVED".equalsIgnoreCase(posting.getStatus())) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Only pending or approved posts can be rejected");
        }

        posting.setStatus("REJECTED");
        posting.setRejectReason(request.getReason());
        posting.setRejectedAt(LocalDateTime.now());
        posting.setApprovedAt(null);
        posting.setApprovedBy(null);

        Posting saved = postingRepository.save(posting);

        return FoodPostActionResponse.builder()
                .id(saved.getId().toString())
                .status("REJECTED")
                .rejectedReason(saved.getRejectReason())
                .rejectedAt(saved.getRejectedAt())
                .message("Food post rejected successfully")
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public FoodPostStatisticsResponse getStatistics() {
        verifyAdmin();

        long totalPosts = postingRepository.count();
        long featuredPosts = postingRepository.countByLikeCountGreaterThanEqual(150);
        long totalCategories = postingRepository.countDistinctCategories();
        long pendingPosts = postingRepository.countByStatus("PENDING");
        long approvedPosts = postingRepository.countByStatus("APPROVED");
        long rejectedPosts = postingRepository.countByStatus("REJECTED");

        return FoodPostStatisticsResponse.builder()
                .totalPosts(totalPosts)
                .featuredPosts(featuredPosts)
                .totalCategories(totalCategories)
                .pendingPosts(pendingPosts)
                .approvedPosts(approvedPosts)
                .rejectedPosts(rejectedPosts)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<FoodCategoryResponse> getFoodCategories() {
        verifyAdmin();

        List<Object[]> rows = postingRepository.findFoodCategoriesWithPostCount();

        return rows.stream().map(row -> {
            String category = (String) row[0];
            Long count = (Long) row[1];
            return FoodCategoryResponse.builder()
                    .id(category)
                    .name(category)
                    .postCount(count != null ? count : 0L)
                    .build();
        }).toList();
    }

    // ================= HELPERS =================

    private User verifyAdmin() {
        User currentUser = getCurrentUser();
        if (currentUser.getRole() != com.teamg5.be.entity.Role.ADMIN) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }
        return currentUser;
    }

    private User getCurrentUser() {
        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED));
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    private AdminFoodPostListItemResponse mapToListItemResponse(Posting p) {
        return AdminFoodPostListItemResponse.builder()
                .id(p.getId().toString())
                .title(p.getTitle())
                .description(p.getContent())
                .imageUrl(p.getThumbnailUrl())
                .restaurantId(p.getRestaurant() != null ? p.getRestaurant().getId().toString() : null)
                .restaurantName(p.getRestaurant() != null ? p.getRestaurant().getName() : null)
                .categoryId(p.getCategory())
                .categoryName(p.getCategory())
                .likesCount(p.getLikeCount())
                .status(p.getStatus())
                .rejectedReason("REJECTED".equalsIgnoreCase(p.getStatus()) ? p.getRejectReason() : null)
                .createdAt(p.getCreatedAt())
                .build();
    }

    private AdminFoodPostDetailResponse mapToDetailResponse(Posting p) {
        return AdminFoodPostDetailResponse.builder()
                .id(p.getId().toString())
                .title(p.getTitle())
                .description(p.getContent())
                .imageUrl(p.getThumbnailUrl())
                .restaurantId(p.getRestaurant() != null ? p.getRestaurant().getId().toString() : null)
                .restaurantName(p.getRestaurant() != null ? p.getRestaurant().getName() : null)
                .restaurantAddress(p.getRestaurant() != null ? p.getRestaurant().getAddress() : null)
                .categoryId(p.getCategory())
                .categoryName(p.getCategory())
                .likesCount(p.getLikeCount())
                .status(p.getStatus())
                .submittedByOwnerId(p.getUser() != null ? p.getUser().getId().toString() : null)
                .submittedByOwnerName(p.getUser() != null ? p.getUser().getFullName() : null)
                .rejectedReason(p.getRejectReason())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}
