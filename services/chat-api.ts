import { apiFetch } from "@/lib/api-client";
import { ConversationResponse, MessageListResponse, SendMessageRequest, MessageResponse } from "@/types/chat";

export const chatApi = {
  getConversations: async () => {
    return apiFetch<ConversationResponse[]>("/api/v1/chat/conversations");
  },

  getMessages: async (conversationId: number, beforeId?: number, limit: number = 50) => {
    const params = new URLSearchParams();
    if (beforeId) params.append("before_id", beforeId.toString());
    params.append("limit", limit.toString());

    return apiFetch<MessageListResponse>(`/api/v1/chat/conversations/${conversationId}/messages?${params.toString()}`);
  },

  sendMessage: async (conversationId: number, data: SendMessageRequest) => {
    return apiFetch<MessageResponse>(`/api/v1/chat/conversations/${conversationId}/messages`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  deleteMessage: async (conversationId: number, messageId: number) => {
    return apiFetch<{ success: boolean }>(`/api/v1/chat/conversations/${conversationId}/messages/${messageId}`, {
      method: "DELETE",
    });
  },
};
