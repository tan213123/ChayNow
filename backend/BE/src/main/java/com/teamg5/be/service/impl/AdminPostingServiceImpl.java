package com.teamg5.be.service.impl;

import com.teamg5.be.dto.PageResponseDTO;
import com.teamg5.be.dto.PostingResponse;
import com.teamg5.be.dto.RejectPostingRequestDTO;
import com.teamg5.be.entity.Posting;
import com.teamg5.be.entity.User;
import com.teamg5.be.exception.AppException;
import com.teamg5.be.exception.ErrorCode;
import com.teamg5.be.repository.PostingRepository;
import com.teamg5.be.repository.UserRepository;
import com.teamg5.be.service.AdminPostingService;
import com.teamg5.be.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminPostingServiceImpl implements AdminPostingService {

    private final PostingRepository postingRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public PageResponseDTO<PostingResponse> getAllPostings(String keyword, String status, int page, int size) {
        if (size > 50) size = 50;
        PageRequest pageable = PageRequest.of(page, size);

        String searchKeyword = (keyword != null && !keyword.isBlank()) ? keyword.trim() : null;
        String searchStatus = (status != null && !status.isBlank()) ? status.trim().toUpperCase() : null;

        Page<Posting> dbPage = postingRepository.findAllForAdmin(searchStatus, searchKeyword, pageable);

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

    @Override
    @Transactional
    public PostingResponse approvePosting(Long postingId) {
        Posting posting = postingRepository.findById(postingId)
                .orElseThrow(() -> new AppException(ErrorCode.POSTING_NOT_FOUND));

        User currentUser = getCurrentUser();

        posting.setStatus("APPROVED");
        posting.setApprovedBy(currentUser);
        posting.setApprovedAt(LocalDateTime.now());
        posting.setRejectReason(null);

        Posting saved = postingRepository.save(posting);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public PostingResponse rejectPosting(Long postingId, RejectPostingRequestDTO request) {
        Posting posting = postingRepository.findById(postingId)
                .orElseThrow(() -> new AppException(ErrorCode.POSTING_NOT_FOUND));

        User currentUser = getCurrentUser();

        posting.setStatus("REJECTED");
        posting.setApprovedBy(currentUser);
        posting.setApprovedAt(LocalDateTime.now());
        posting.setRejectReason(request.getReason());

        Posting saved = postingRepository.save(posting);
        return mapToResponse(saved);
    }

    private User getCurrentUser() {
        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED));
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
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
                .rejectReason("REJECTED".equalsIgnoreCase(p.getStatus()) ? p.getRejectReason() : null)
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
}
