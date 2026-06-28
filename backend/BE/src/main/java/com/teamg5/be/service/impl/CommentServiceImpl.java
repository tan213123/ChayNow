package com.teamg5.be.service.impl;

import com.teamg5.be.dto.CommentResponse;
import com.teamg5.be.dto.CreateCommentRequest;
import com.teamg5.be.dto.PageResponseDTO;
import com.teamg5.be.entity.AccountStatus;
import com.teamg5.be.entity.Comment;
import com.teamg5.be.entity.Posting;
import com.teamg5.be.entity.User;
import com.teamg5.be.exception.AppException;
import com.teamg5.be.exception.ErrorCode;
import com.teamg5.be.repository.CommentRepository;
import com.teamg5.be.repository.PostingRepository;
import com.teamg5.be.repository.UserRepository;
import com.teamg5.be.service.CommentService;
import com.teamg5.be.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import com.teamg5.be.entity.NotificationType;
import com.teamg5.be.event.SystemNotificationEvent;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final PostingRepository postingRepository;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public CommentResponse createComment(Long postingId, CreateCommentRequest request) {
        User currentUser = requireActiveUser();
        Posting posting = postingRepository.findApprovedById(postingId)
                .orElseThrow(() -> new AppException(ErrorCode.POSTING_NOT_FOUND));

        String content = request.getContent() == null ? null : request.getContent().trim();
        if (!StringUtils.hasText(content)) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Nội dung bình luận không được để trống");
        }
        if (content.length() > 1000) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Nội dung bình luận phải tối đa 1000 ký tự");
        }

        Comment comment = Comment.builder()
                .user(currentUser)
                .posting(posting)
                .content(content)
                .build();

        Comment saved = commentRepository.save(comment);
        incrementCommentCount(posting);

        try {
            if (posting.getUser() != null && !posting.getUser().getId().equals(currentUser.getId())) {
                eventPublisher.publishEvent(new SystemNotificationEvent(
                        posting.getUser(),
                        "Bình luận mới trên bài viết",
                        "Người dùng " + currentUser.getFullName() + " đã bình luận trên bài viết '" + posting.getTitle() + "' của bạn",
                        NotificationType.NEW_REVIEW_COMMENT,
                        posting.getId().toString()
                ));
            }
        } catch (Exception e) {
            // Log warning but don't fail comment transaction
        }

        return CommentResponse.from(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponseDTO<CommentResponse> getCommentsByPosting(Long postingId, int page, int size) {
        if (size > 50) size = 50;

        postingRepository.findApprovedById(postingId)
                .orElseThrow(() -> new AppException(ErrorCode.POSTING_NOT_FOUND));

        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "createdAt"));
        Page<Comment> dbPage = commentRepository.findByPosting_IdOrderByCreatedAtAsc(postingId, pageable);

        List<CommentResponse> content = dbPage.getContent().stream()
                .map(CommentResponse::from)
                .toList();

        return PageResponseDTO.<CommentResponse>builder()
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
    public void deleteMyComment(Long commentId) {
        User currentUser = requireActiveUser();
        Comment comment = commentRepository.findByIdAndUser_Id(commentId, currentUser.getId())
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));

        Posting posting = comment.getPosting();
        commentRepository.delete(comment);
        decrementCommentCount(posting);
    }

    @Override
    @Transactional
    public void deleteCommentById(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));

        Posting posting = comment.getPosting();
        commentRepository.delete(comment);
        decrementCommentCount(posting);
    }

    @Override
    @Transactional(readOnly = true)
    public Comment getCommentById(Long commentId) {
        return commentRepository.findById(commentId)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));
    }

    private void incrementCommentCount(Posting posting) {
        if (posting.getCommentCount() == null) {
            posting.setCommentCount(0);
        }
        posting.setCommentCount(posting.getCommentCount() + 1);
        postingRepository.save(posting);
    }

    private void decrementCommentCount(Posting posting) {
        if (posting == null) {
            return;
        }
        if (posting.getCommentCount() == null || posting.getCommentCount() <= 0) {
            posting.setCommentCount(0);
        } else {
            posting.setCommentCount(posting.getCommentCount() - 1);
        }
        postingRepository.save(posting);
    }

    private User requireActiveUser() {
        String email = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED));

        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (currentUser.getStatus() != AccountStatus.ACTIVE) {
            throw new AppException(ErrorCode.FORBIDDEN, "Người dùng bị khóa hoặc không hoạt động không thể bình luận");
        }

        return currentUser;
    }
}
