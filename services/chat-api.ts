import { apiFetch } from "@/lib/api-client";
import {
  ChatAttachmentUploadResponse,
  CreateTicketRequest,
  SendTicketMessageRequest,
  TicketListResponse,
  TicketMessageListResponse,
  TicketMessageResponse,
  TicketResponse
} from "@/types/chat";

export const chatApi = {
  getTickets: async (token: string, params: {
    scope?: 'auto' | 'owner' | 'provider' | 'all',
    status_filter?: 'active' | 'archived' | 'blocked',
    skip?: number,
    limit?: number
  } = {}) => {
    const query = new URLSearchParams();
    if (params.scope) query.append('scope', params.scope);
    if (params.status_filter) query.append('status_filter', params.status_filter);
    if (params.skip) query.append('skip', params.skip.toString());
    if (params.limit) query.append('limit', params.limit.toString());

    return apiFetch<TicketListResponse>(`/api/v1/chat/tickets?${query.toString()}`, { token });
  },

  getTicket: async (token: string, ticketId: number) => {
    return apiFetch<TicketResponse>(`/api/v1/chat/tickets/${ticketId}`, { token });
  },

  createTicket: async (token: string, data: CreateTicketRequest) => {
    return apiFetch<TicketResponse>(`/api/v1/chat/tickets`, {
      method: "POST",
      body: JSON.stringify(data),
      token,
    });
  },

  getMessages: async (token: string, ticketId: number, beforeId?: number, limit: number = 50) => {
    const params = new URLSearchParams();
    if (beforeId) params.append("before_id", beforeId.toString());
    params.append("limit", limit.toString());

    return apiFetch<TicketMessageListResponse>(`/api/v1/chat/tickets/${ticketId}/messages?${params.toString()}`, { token });
  },

  sendMessage: async (token: string, ticketId: number, data: SendTicketMessageRequest) => {
    return apiFetch<TicketMessageResponse>(`/api/v1/chat/tickets/${ticketId}/messages`, {
      method: "POST",
      body: JSON.stringify(data),
      token,
    });
  },

  deleteMessage: async (token: string, ticketId: number, messageId: number) => {
    return apiFetch<{ message: string }>(`/api/v1/chat/tickets/${ticketId}/messages/${messageId}`, {
      method: "DELETE",
      token,
    });
  },

  uploadAttachment: async (token: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiFetch<ChatAttachmentUploadResponse>("/api/v1/chat/attachments", {
      method: "POST",
      body: formData,
      token,
    });
  }
};
