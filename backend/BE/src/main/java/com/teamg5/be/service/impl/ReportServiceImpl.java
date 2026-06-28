package com.teamg5.be.service.impl;

import com.teamg5.be.dto.CreateReportRequest;
import com.teamg5.be.dto.ReportResponse;
import com.teamg5.be.entity.Report;
import com.teamg5.be.entity.ReportStatus;
import com.teamg5.be.entity.ReportTargetType;
import com.teamg5.be.entity.User;
import com.teamg5.be.exception.AppException;
import com.teamg5.be.exception.ErrorCode;
import com.teamg5.be.repository.CommentRepository;
import com.teamg5.be.repository.PostingRepository;
import com.teamg5.be.repository.ReportRepository;
import com.teamg5.be.repository.RestaurantRepository;
import com.teamg5.be.repository.ReviewRepository;
import com.teamg5.be.repository.UserRepository;
import com.teamg5.be.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final PostingRepository postingRepository;
    private final ReviewRepository reviewRepository;
    private final CommentRepository commentRepository;

    @Override
    public ReportResponse createReport(CreateReportRequest request) {
        User currentUser = getCurrentUser();

        // Validate target existence
        validateTargetExists(request.getTargetType(), request.getTargetId());

        Report report = Report.builder()
                .reporter(currentUser)
                .targetType(request.getTargetType())
                .targetId(request.getTargetId())
                .reason(request.getReason())
                .details(request.getDetails())
                .status(ReportStatus.PENDING)
                .build();

        Report saved = reportRepository.save(report);

        return ReportResponse.builder()
                .id(saved.getId())
                .reporterEmail(currentUser.getEmail())
                .targetType(saved.getTargetType().name())
                .targetId(saved.getTargetId())
                .reason(saved.getReason())
                .details(saved.getDetails())
                .status(saved.getStatus().name())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    private void validateTargetExists(ReportTargetType targetType, Long targetId) {
        switch (targetType) {
            case RESTAURANT:
                if (!restaurantRepository.existsById(targetId)) {
                    throw new AppException(ErrorCode.RESTAURANT_NOT_FOUND, "Không tìm thấy nhà hàng này");
                }
                break;
            case POST:
                if (!postingRepository.existsById(targetId)) {
                    throw new AppException(ErrorCode.POSTING_NOT_FOUND, "Không tìm thấy bài đăng này");
                }
                break;
            case REVIEW:
                if (!reviewRepository.existsById(targetId)) {
                    throw new AppException(ErrorCode.REVIEW_NOT_FOUND, "Không tìm thấy đánh giá này");
                }
                break;
            case COMMENT:
                if (!commentRepository.existsById(targetId)) {
                    throw new AppException(ErrorCode.COMMENT_NOT_FOUND, "Không tìm thấy bình luận này");
                }
                break;
            default:
                throw new AppException(ErrorCode.INVALID_INPUT, "Loại đối tượng báo cáo không hợp lệ");
        }
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
