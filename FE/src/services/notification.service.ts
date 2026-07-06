import apiService from "./api.service";

export type NotificationType =
  | "NEW_RESTAURANT"
  | "NEW_DISH"
  | "NEW_POST"
  | "NEW_USER"
  | "ADMIN_USER_NOTICE"
  | "NEW_REVIEW_COMMENT"
  | "NEW_RATING_STAR"
  | "POST_STATUS_UPDATE"
  | "RESTAURANT_STATUS_UPDATE"
  | "ADMIN_OWNER_NOTICE"
  | "USER_REPORT"
  | "RESTAURANT_APPROVAL_REQUEST";

export interface NotificationResponse {
  id: number;
  title: string;
  content: string;
  type: NotificationType;
  targetId: string;
  isRead: boolean;
  createdAt: string;
}

type RawNotificationResponse = Omit<NotificationResponse, "isRead"> & {
  isRead?: boolean;
  read?: boolean;
};

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export const getNotifications = async (
  page = 0,
  size = 20,
  unreadOnly = false
) => {
  const response = await apiService.get<any>(`/api/notifications`, {
    params: { page, size, unreadOnly },
  });
  return {
    ...response.data,
    content: response.data.content.map(normalizeNotification),
  };
};

export const normalizeNotification = (
  notification: RawNotificationResponse
): NotificationResponse => ({
  ...notification,
  isRead: Boolean(notification.isRead ?? notification.read),
});

export const markAsRead = async (id: number) => {
  const response = await apiService.patch(`/api/notifications/${id}/read`);
  return response.data;
};

export const markAllAsRead = async () => {
  const response = await apiService.patch(`/api/notifications/read-all`);
  return response.data;
};

export const deleteNotification = async (id: number) => {
  const response = await apiService.delete(`/api/notifications/${id}`);
  return response.data;
};
