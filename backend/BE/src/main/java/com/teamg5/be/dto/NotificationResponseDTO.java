package com.teamg5.be.dto;

import com.teamg5.be.entity.NotificationType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponseDTO {
    private Long id;
    private String title;
    private String content;
    private NotificationType type;
    private String targetId;
    private boolean isRead;
    private LocalDateTime createdAt;
}
