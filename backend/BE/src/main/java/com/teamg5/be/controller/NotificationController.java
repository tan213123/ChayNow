package com.teamg5.be.controller;

import com.teamg5.be.dto.ApiResponse;
import com.teamg5.be.dto.NotificationResponseDTO;
import com.teamg5.be.dto.PageResponseDTO;
import com.teamg5.be.entity.User;
import com.teamg5.be.exception.AppException;
import com.teamg5.be.exception.ErrorCode;
import com.teamg5.be.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notification Management", description = "APIs for user notifications and real-time event streaming")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @Operation(summary = "Lấy danh sách thông báo", description = "Lấy danh sách thông báo của người dùng đang đăng nhập phân trang")
    public ResponseEntity<ApiResponse<PageResponseDTO<NotificationResponseDTO>>> getNotifications(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size,
            @RequestParam(name = "unreadOnly", defaultValue = "false") boolean unreadOnly
    ) {
        User currentUser = getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);
        Page<NotificationResponseDTO> result = notificationService.getNotificationsForUser(currentUser.getId(), unreadOnly, pageable);

        PageResponseDTO<NotificationResponseDTO> responseDTO = PageResponseDTO.<NotificationResponseDTO>builder()
                .content(result.getContent())
                .page(result.getNumber())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .last(result.isLast())
                .build();

        return ResponseEntity.ok(ApiResponse.<PageResponseDTO<NotificationResponseDTO>>builder()
                .success(true)
                .message("Get notifications successfully")
                .data(responseDTO)
                .build());
    }

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @Operation(summary = "Đăng ký nhận thông báo thời gian thực via SSE", description = "Đăng ký nhận server-sent events. Cần truyền token qua query parameter hoặc header.")
    public SseEmitter streamNotifications() {
        User currentUser = getCurrentUser();
        return notificationService.createStream(currentUser.getId());
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Đánh dấu một thông báo đã đọc")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable(name = "id") Long id) {
        User currentUser = getCurrentUser();
        notificationService.markAsRead(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Marked notification as read successfully")
                .build());
    }

    @PatchMapping("/read-all")
    @Operation(summary = "Đánh dấu tất cả thông báo là đã đọc")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead() {
        User currentUser = getCurrentUser();
        notificationService.markAllAsRead(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Marked all notifications as read successfully")
                .build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa thông báo")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(@PathVariable(name = "id") Long id) {
        User currentUser = getCurrentUser();
        notificationService.deleteNotification(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Deleted notification successfully")
                .build());
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
        throw new AppException(ErrorCode.UNAUTHORIZED);
    }
}
