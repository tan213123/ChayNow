package com.teamg5.be.event;

import com.teamg5.be.entity.NotificationType;
import com.teamg5.be.entity.User;
import lombok.Getter;

@Getter
public class SystemNotificationEvent {
    private final User recipient;
    private final String title;
    private final String content;
    private final NotificationType type;
    private final String targetId;

    public SystemNotificationEvent(User recipient, String title, String content, NotificationType type, String targetId) {
        this.recipient = recipient;
        this.title = title;
        this.content = content;
        this.type = type;
        this.targetId = targetId;
    }
}
