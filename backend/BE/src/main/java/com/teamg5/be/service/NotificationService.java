package com.teamg5.be.service;

import com.teamg5.be.dto.NotificationResponseDTO;
import com.teamg5.be.entity.NotificationType;
import com.teamg5.be.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

public interface NotificationService {
    Page<NotificationResponseDTO> getNotificationsForUser(Long userId, Boolean unreadOnly, Pageable pageable);
    void markAsRead(Long notificationId, Long userId);
    void markAllAsRead(Long userId);
    void deleteNotification(Long notificationId, Long userId);
    SseEmitter createStream(Long userId);
    void sendNotification(User recipient, String title, String content, NotificationType type, String targetId);
}
