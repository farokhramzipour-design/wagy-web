export interface ChatUser {
  user_id: number;
  name: string;
  avatar_url: string | null;
}

export interface LastMessage {
  text: string | null;
  type: string;
  at: string;
}

export interface TicketResponse {
  ticket_id: number;
  booking_id: number | null;
  subject: string;
  owner: ChatUser;
  sitter: ChatUser;
  viewer_scope: "owner" | "provider";
  last_message: LastMessage | null;
  unread_count: number;
  status: "active" | "archived" | "blocked";
  created_at: string;
  updated_at: string;
}

export interface TicketListResponse {
  total: number;
  items: TicketResponse[];
}

export interface TicketMessageResponse {
  message_id: number;
  ticket_id: number;
  sender_id: number;
  sender_name: string;
  sender_avatar: string | null;
  message_type: "text" | "image" | "file" | "system";
  attachment_type: string | null;
  media_mime_type: string | null;
  text: string | null;
  media_url: string | null;
  media_thumbnail_url: string | null;
  is_deleted: boolean;
  created_at: string;
}

export interface TicketMessageListResponse {
  ticket_id: number;
  messages: TicketMessageResponse[];
  has_more: boolean;
}

export interface CreateTicketRequest {
  provider_id: number;
  subject?: string;
  booking_id?: number;
  text?: string | null;
  media_id?: number | null;
}

export interface SendTicketMessageRequest {
  text?: string | null;
  media_id?: number | null;
}

export interface ChatAttachmentUploadResponse {
  media_id: number;
  url: string;
  thumb_url: string | null;
  mime_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  attachment_type: string;
  created_at: string;
}

// Keeping legacy types for compatibility if needed, but aliasing or marking deprecated
export type ConversationResponse = TicketResponse; // Approximate mapping if needed, but structure is different.
// Ideally we should stop using ConversationResponse in new code.
