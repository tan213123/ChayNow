import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, Trash2, Inbox } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  type NotificationResponse,
} from "@/services/notification.service";

export default function NotificationDropdown() {
  const { accessToken, user } = useAuthStore();
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch notifications initially
  const fetchNotifications = async () => {
    if (!accessToken) return;
    try {
      const data = await getNotifications(0, 10, false);
      if (data && data.content) {
        setNotifications(data.content);
        // Calculate unread count
        const unread = data.content.filter((n: NotificationResponse) => !n.isRead).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [accessToken]);

  // Establish SSE stream
  useEffect(() => {
    if (!accessToken || !user) return;

    const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
    // EventSource constructor requires URL. Query param "token" is checked by JwtAuthenticationFilter
    const sseUrl = `${baseUrl}/api/notifications/stream?token=${accessToken}`;
    const eventSource = new EventSource(sseUrl);

    eventSource.onmessage = (event) => {
      // General messages
      console.log("SSE Message:", event.data);
    };

    eventSource.addEventListener("notification", (event: MessageEvent) => {
      try {
        const newNotif = JSON.parse(event.data) as NotificationResponse;
        
        // Add to list
        setNotifications((prev) => [newNotif, ...prev.slice(0, 9)]);
        setUnreadCount((prev) => prev + 1);

        // Show toast
        toast.info(newNotif.title, {
          description: newNotif.content,
          action: {
            label: "Xem",
            onClick: () => handleNotificationClick(newNotif),
          },
        });
      } catch (err) {
        console.error("Error parsing SSE notification:", err);
      }
    });

    eventSource.addEventListener("connect", (event: MessageEvent) => {
      console.log("SSE Connected:", event.data);
    });

    eventSource.onerror = (err) => {
      console.error("SSE Connection error:", err);
      // EventSource automatically retries connection, but let's log it
    };

    return () => {
      eventSource.close();
    };
  }, [accessToken, user]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success("Đã đánh dấu tất cả là đã đọc");
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      await deleteNotification(id);
      const target = notifications.find((n) => n.id === id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (target && !target.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      toast.success("Đã xóa thông báo");
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleNotificationClick = (notif: NotificationResponse) => {
    if (!notif.isRead) {
      handleMarkAsRead(notif.id);
    }
    setIsOpen(false);

    // Deep routing based on notification type
    switch (notif.type) {
      case "NEW_RESTAURANT":
      case "NEW_DISH":
      case "RESTAURANT_STATUS_UPDATE":
        if (notif.targetId) {
          // If Owner or Admin, route to management page, else customer detail page
          if (user?.role === "OWNER" || user?.role === "ADMIN") {
            navigate(`/manage/restaurants/${notif.targetId}`);
          } else {
            navigate(`/restaurants/${notif.targetId}`);
          }
        }
        break;
      case "NEW_REVIEW_COMMENT":
      case "NEW_RATING_STAR":
        if (notif.targetId) {
          navigate(`/manage/restaurants/${notif.targetId}/reviews`);
        }
        break;
      case "USER_REPORT":
        if (user?.role === "ADMIN") {
          navigate(`/admin/reports/${notif.targetId}`);
        }
        break;
      case "RESTAURANT_APPROVAL_REQUEST":
        if (user?.role === "ADMIN") {
          navigate(`/admin/restaurants`); // or specific admin approval tab
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white shadow-xl ring-1 ring-black/5 z-50 overflow-hidden transform origin-top-right transition-all">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-4 py-3">
            <h3 className="font-semibold text-slate-800 text-sm">Thông báo</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Đọc tất cả
              </button>
            )}
          </div>

          <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <Inbox className="h-8 w-8 text-slate-300 mb-2" />
                <p className="text-sm font-medium text-slate-500">Không có thông báo nào</p>
                <p className="text-xs text-slate-400">Bạn sẽ nhận được cập nhật từ hệ thống tại đây.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`flex gap-3 p-4 text-left transition hover:bg-slate-50/80 cursor-pointer relative ${
                    !notif.isRead ? "bg-emerald-50/20" : ""
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-semibold truncate ${
                        !notif.isRead ? "text-slate-900" : "text-slate-700"
                      }`}>
                        {notif.title}
                      </p>
                      {!notif.isRead && (
                        <span className="h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className={`text-xs mt-1 leading-relaxed ${
                      !notif.isRead ? "text-slate-600 font-medium" : "text-slate-500"
                    }`}>
                      {notif.content}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-2 block font-medium">
                      {new Date(notif.createdAt).toLocaleString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, notif.id)}
                    className="self-center p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-rose-600 transition"
                    aria-label="Xóa thông báo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
