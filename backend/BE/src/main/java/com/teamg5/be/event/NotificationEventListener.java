package com.teamg5.be.event;

import com.teamg5.be.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationEventListener {

    private final NotificationService notificationService;

    @EventListener
    public void handleSystemNotification(SystemNotificationEvent event) {
        notificationService.sendNotification(
                event.getRecipient(),
                event.getTitle(),
                event.getContent(),
                event.getType(),
                event.getTargetId()
        );
    }
}
