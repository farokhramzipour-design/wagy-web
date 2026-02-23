export interface NotificationInboxItemResponse {
  notification_id: number;
  title: string | null;
  body: string;
  action_url: string | null;
  action_type: string | null;
  action_id: number | null;
  is_read: boolean;
  created_at: string;
}

export interface NotificationInboxResponse {
  unread_count: number;
  notifications: NotificationInboxItemResponse[];
}

export interface ActionResponse {
  message: string;
}
