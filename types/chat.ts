export interface OtherUserResponse {
  user_id: number;
  name: string;
  avatar_url?: string | null;
  is_online: boolean;
}

export interface LastMessageResponse {
  text?: string | null;
  type?: string | null;
  at?: string | null;
}

export interface ConversationResponse {
  conversation_id: number;
  booking_id: number;
  other_user: OtherUserResponse;
  last_message: LastMessageResponse;
  unread_count: number;
  status: string;
}

export interface MessageResponse {
  message_id: number;
  conversation_id: number;
  sender_id: number;
  sender_name: string;
  sender_avatar?: string | null;
  message_type: string;
  text?: string | null;
  media_url?: string | null;
  media_thumbnail_url?: string | null;
  is_deleted: boolean;
  created_at: string;
}

export interface MessageListResponse {
  conversation_id: number;
  messages: MessageResponse[];
  has_more: boolean;
}

export interface SendMessageRequest {
  text?: string | null;
  media_id?: number | null;
}
