import { ActionResponse, NotificationInboxResponse } from "@/types/notification";

async function clientFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(path, options);
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }
  return res.json();
}

export const notificationApi = {
  getInbox: async (unreadOnly = false, skip = 0, limit = 20) => {
    const params = new URLSearchParams({
      unread_only: unreadOnly.toString(),
      skip: skip.toString(),
      limit: limit.toString(),
    });
    return clientFetch<NotificationInboxResponse>(`/api/notifications/inbox?${params}`);
  },

  markAsRead: async (notificationId: number) => {
    return clientFetch<ActionResponse>(`/api/notifications/inbox/${notificationId}/read`, {
      method: "POST",
    });
  },

  markAllAsRead: async () => {
    return clientFetch<ActionResponse>("/api/notifications/inbox/read-all", {
      method: "POST",
    });
  },
};
