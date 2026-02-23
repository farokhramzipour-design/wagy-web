"use client";

import { useEffect, useState } from "react";
import { Bell, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLanguage } from "@/components/providers/language-provider";
import { notificationApi } from "@/services/notification-api";
import { NotificationInboxItemResponse } from "@/types/notification";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { formatDistanceToNow } from "date-fns";
import { format } from "date-fns-jalali";
import { cn } from "@/lib/utils";
import Link from "next/link";

const content = { en, fa };

export function NotificationList() {
  const { lang } = useLanguage();
  const t = (content[lang] as any).dashboard.notifications;
  const [notifications, setNotifications] = useState<NotificationInboxItemResponse[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationApi.getInbox();
      setNotifications(data.notifications);
      setUnreadCount(data.unread_count);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setUnreadCount(0);
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  const handleMarkRead = async (id: number) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.notification_id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const handleNotificationClick = async (notification: NotificationInboxItemResponse) => {
    if (!notification.is_read) {
      await handleMarkRead(notification.notification_id);
    }
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-neutral-600" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
          <h4 className="font-semibold text-sm">{t.title}</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-2 py-1 text-xs text-[#0ea5a4] hover:text-[#0b7c7b]"
              onClick={handleMarkAllRead}
            >
              {t.markAllRead}
            </Button>
          )}
        </div>
        <div className="h-[300px] overflow-y-auto">
          {loading && notifications.length === 0 ? (
            <div className="flex items-center justify-center h-full p-4 text-neutral-500 text-sm">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              {t.loading}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex items-center justify-center h-full p-4 text-neutral-500 text-sm">
              {t.empty}
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {notifications.map((notification) => (
                <div
                  key={notification.notification_id}
                  className={cn(
                    "flex flex-col gap-1 p-4 hover:bg-neutral-50 transition-colors cursor-pointer",
                    !notification.is_read && "bg-blue-50/50"
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-medium text-neutral-900 line-clamp-1">
                      {notification.title || t.title}
                    </span>
                    {!notification.is_read && (
                      <span className="h-2 w-2 rounded-full bg-[#0ea5a4] flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                  <p className="text-xs text-neutral-600 line-clamp-2">
                    {notification.body}
                  </p>
                  <span className="text-[10px] text-neutral-400">
                    {lang === 'fa'
                      ? format(new Date(notification.created_at), "yyyy/MM/dd HH:mm")
                      : formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })
                    }
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
