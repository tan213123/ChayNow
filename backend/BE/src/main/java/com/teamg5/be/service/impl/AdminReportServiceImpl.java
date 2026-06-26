package com.teamg5.be.service.impl;

import com.teamg5.be.dto.*;
import com.teamg5.be.entity.*;
import com.teamg5.be.exception.AppException;
import com.teamg5.be.exception.ErrorCode;
import com.teamg5.be.service.CommentService;
import com.teamg5.be.repository.*;
import com.teamg5.be.service.AdminReportService;
import com.teamg5.be.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminReportServiceImpl implements AdminReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final CommentRepository commentRepository;
    private final CommentService commentService;
    private final PostingRepository postingRepository;
    private final RestaurantRepository restaurantRepository;

    @Override
    @Transactional(readOnly = true)
    public PageResponseDTO<ReportListItemResponse> getAllReports(
            String status,
            String type,
            String keyword,
            int page,
            int size
    ) {
        verifyAdmin();

        if (size > 50) {
            size = 50;
        }

        ReportStatus statusEnum = null;
        if (status != null && !status.trim().isEmpty()) {
            try {
                statusEnum = ReportStatus.valueOf(status.trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new AppException(ErrorCode.INVALID_INPUT, "Invalid status: " + status);
            }
        }

        ReportTargetType typeEnum = null;
        if (type != null && !type.trim().isEmpty()) {
            try {
                typeEnum = ReportTargetType.valueOf(type.trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new AppException(ErrorCode.INVALID_INPUT, "Invalid type: " + type);
            }
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<Report> dbPage = reportRepository.findAllFiltered(statusEnum, typeEnum, keyword, pageable);

        List<ReportListItemResponse> content = dbPage.getContent().stream()
                .map(this::mapToListItemResponse)
                .toList();

        return PageResponseDTO.<ReportListItemResponse>builder()
                .content(content)
                .page(dbPage.getNumber())
                .size(dbPage.getSize())
                .totalElements(dbPage.getTotalElements())
                .totalPages(dbPage.getTotalPages())
                .last(dbPage.isLast())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public ReportStatsResponse getStats() {
        verifyAdmin();

        long total = reportRepository.count();
        long pending = reportRepository.countByStatus(ReportStatus.PENDING);
        long resolved = reportRepository.countByStatus(ReportStatus.RESOLVED);
        long rejected = reportRepository.countByStatus(ReportStatus.REJECTED);

        return ReportStatsResponse.builder()
                .totalReports(total)
                .pendingReports(pending)
                .resolvedReports(resolved)
                .rejectedReports(rejected)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public ReportDetailResponse getReportDetail(Long id) {
        verifyAdmin();

        Report report = reportRepository.findByIdWithReporter(id)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Report not found with id: " + id));

        return mapToDetailResponse(report);
    }

    // ================= HELPERS =================

    private User verifyAdmin() {
        User currentUser = getCurrentUser();
        if (currentUser.getRole() != Role.ADMIN && currentUser.getRole() != Role.MODERATOR) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }
        return currentUser;
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

    private ReportListItemResponse mapToListItemResponse(Report report) {
        ReportReporterDTO reporterDTO = ReportReporterDTO.builder()
                .id(report.getReporter().getId())
                .fullName(report.getReporter().getFullName())
                .avatarUrl(report.getReporter().getAvatarUrl())
                .build();

        ReportTargetDTO targetDTO = resolveTarget(report.getTargetType(), report.getTargetId(), false);

        return ReportListItemResponse.builder()
                .id(report.getId())
                .type(report.getTargetType().name())
                .status(report.getStatus().name())
                .reason(report.getReason())
                .createdAt(report.getCreatedAt())
                .reporter(reporterDTO)
                .target(targetDTO)
                .build();
    }

    private ReportDetailResponse mapToDetailResponse(Report report) {
        ReportReporterDTO reporterDTO = ReportReporterDTO.builder()
                .id(report.getReporter().getId())
                .fullName(report.getReporter().getFullName())
                .email(report.getReporter().getEmail())
                .avatarUrl(report.getReporter().getAvatarUrl())
                .build();

        ReportTargetDTO targetDTO = resolveTarget(report.getTargetType(), report.getTargetId(), true);

        return ReportDetailResponse.builder()
                .id(report.getId())
                .status(report.getStatus().name())
                .reason(report.getReason())
                .description(report.getDetails())
                .createdAt(report.getCreatedAt())
                .reporter(reporterDTO)
                .target(targetDTO)
                .build();
    }

    private ReportTargetDTO resolveTarget(ReportTargetType type, Long targetId, boolean includeOwner) {
        ReportTargetDTO.ReportTargetDTOBuilder builder = ReportTargetDTO.builder()
                .id(targetId)
                .type(type.name());

        if (type == ReportTargetType.REVIEW) {
            reviewRepository.findById(targetId).ifPresentOrElse(review -> {
                builder.title("Đánh giá");
                builder.content(review.getContext());
                if (includeOwner && review.getUser() != null) {
                    builder.ownerId(review.getUser().getId());
                }
            }, () -> {
                builder.title("Đánh giá");
                builder.content("[Nội dung đã bị xóa]");
            });
        } else if (type == ReportTargetType.POST) {
            postingRepository.findById(targetId).ifPresentOrElse(post -> {
                builder.title(post.getTitle());
                builder.content(post.getContent());
                if (includeOwner && post.getUser() != null) {
                    builder.ownerId(post.getUser().getId());
                }
            }, () -> {
                builder.title("Bài đăng");
                builder.content("[Nội dung đã bị xóa]");
            });
        } else if (type == ReportTargetType.COMMENT) {
            commentRepository.findById(targetId).ifPresentOrElse(comment -> {
                builder.title("Bình luận");
                builder.content(comment.getContent());
                if (includeOwner && comment.getUser() != null) {
                    builder.ownerId(comment.getUser().getId());
                }
            }, () -> {
                builder.title("Bình luận");
                builder.content("[Nội dung đã bị xóa]");
            });
        } else if (type == ReportTargetType.RESTAURANT) {
            restaurantRepository.findById(targetId).ifPresentOrElse(restaurant -> {
                builder.title(restaurant.getName());
                builder.content(restaurant.getDescription());
                if (includeOwner && restaurant.getOwner() != null) {
                    builder.ownerId(restaurant.getOwner().getId());
                }
            }, () -> {
                builder.title("Nhà hàng");
                builder.content("[Nội dung đã bị xóa]");
            });
        } else {
            builder.title("Nội dung");
            builder.content("[Nội dung đã bị xóa]");
        }

        return builder.build();
    }

    @Override
    @Transactional
    public ReportActionResponse resolveReport(Long reportId, ResolveReportRequest request) {
        User admin = verifyAdmin();

        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Report not found with id: " + reportId));

        if (report.getStatus() != ReportStatus.PENDING) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Report is already resolved or rejected");
        }

        String action = request.getAction().trim().toUpperCase();
        ReportStatus newStatus;
        String message;

        if ("ACCEPT".equals(action)) {
            newStatus = ReportStatus.RESOLVED;
            message = "Report accepted and violating content removed. Warning issued to the user.";

            // Remove/disable violating content
            User contentCreator = null;
            if (report.getTargetType() == ReportTargetType.REVIEW) {
                Review review = reviewRepository.findById(report.getTargetId()).orElse(null);
                if (review != null) {
                    contentCreator = review.getUser();
                    reviewRepository.delete(review);
                }
            } else if (report.getTargetType() == ReportTargetType.COMMENT) {
                Comment comment = commentRepository.findById(report.getTargetId()).orElse(null);
                if (comment != null) {
                    contentCreator = comment.getUser();
                    commentService.deleteCommentById(comment.getId());
                }
            } else if (report.getTargetType() == ReportTargetType.POST) {
                Posting post = postingRepository.findById(report.getTargetId()).orElse(null);
                if (post != null) {
                    contentCreator = post.getUser();
                    post.setStatus("REJECTED");
                    post.setRejectReason("Nội dung vi phạm tiêu chuẩn cộng đồng (bị báo cáo)");
                    post.setRejectedAt(java.time.LocalDateTime.now());
                    postingRepository.save(post);
                }
            } else if (report.getTargetType() == ReportTargetType.RESTAURANT) {
                Restaurant restaurant = restaurantRepository.findById(report.getTargetId()).orElse(null);
                if (restaurant != null) {
                    contentCreator = restaurant.getOwner();
                    restaurant.setStatus(RestaurantStatus.REJECTED);
                    restaurant.setRejectReason("Nhà hàng vi phạm tiêu chuẩn cộng đồng (bị báo cáo)");
                    restaurant.setActive(false);
                    restaurantRepository.save(restaurant);
                }
            }

            // Issue warning to creator
            if (contentCreator != null) {
                contentCreator.setWarningCount(contentCreator.getWarningCount() + 1);
                if (contentCreator.getWarningCount() >= 3) {
                    contentCreator.setStatus(AccountStatus.SUSPENDED);
                    message += " Creator has reached 3 warnings and is now SUSPENDED.";
                }
                userRepository.save(contentCreator);
            }
        } else if ("REJECT".equals(action)) {
            newStatus = ReportStatus.REJECTED;
            message = "Report rejected.";
        } else {
            throw new AppException(ErrorCode.INVALID_INPUT, "Invalid action: " + action + ". Must be ACCEPT or REJECT");
        }

        report.setStatus(newStatus);
        report.setResolvedBy(admin);
        report.setResolvedAt(java.time.LocalDateTime.now());
        if (request.getDetails() != null) {
            report.setDetails(request.getDetails());
        }
        reportRepository.save(report);

        return ReportActionResponse.builder()
                .reportId(report.getId())
                .status(newStatus.name())
                .message(message)
                .resolvedAt(report.getResolvedAt())
                .build();
    }
}
