"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { chatApi } from "@/services/chat-api";
import { TicketMessageResponse, TicketResponse } from "@/types/chat";
import { formatDistanceToNow } from "date-fns";
import { format } from "date-fns-jalali";
import { ArrowLeft, Image as ImageIcon, Loader2, Paperclip, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { API_BASE_URL } from "@/lib/api-client";

const content = { en, fa };

interface ChatDetailProps {
  token: string;
  userId: number;
  ticketId: number;
}

export function ChatDetail({ token, userId, ticketId }: ChatDetailProps) {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = (content[lang] as any).dashboard.chat;

  const [ticket, setTicket] = useState<TicketResponse | null>(null);
  const [messages, setMessages] = useState<TicketMessageResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [inputText, setInputText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getMediaUrl = (url: string | null) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  useEffect(() => {
    const init = async () => {
      try {
        const [ticketData, msgList] = await Promise.all([
          chatApi.getTicket(token, ticketId),
          chatApi.getMessages(token, ticketId)
        ]);

        setTicket(ticketData);
        setMessages(msgList.messages);
      } catch (error) {
        console.error("Failed to load chat", error);
        toast.error(t?.error || "Failed to load chat");
      } finally {
        setLoading(false);
      }
    };

    if (ticketId) {
      init();
    }
  }, [ticketId, token, t?.error]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    try {
      setSending(true);
      const newMessage = await chatApi.sendMessage(token, ticketId, { text: inputText });
      setMessages(prev => [...prev, newMessage]);
      setInputText("");
    } catch (error) {
      console.error("Failed to send message", error);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      // 1. Upload attachment
      const uploadResp = await chatApi.uploadAttachment(token, file);

      // 2. Send message with media_id
      const newMessage = await chatApi.sendMessage(token, ticketId, {
        media_id: uploadResp.media_id
      });

      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error("Failed to upload file", error);
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-neutral-500">
        <p>Ticket not found</p>
        <Button variant="link" onClick={() => router.push("/app/chat")}>
          Back to list
        </Button>
      </div>
    );
  }

  const isOwner = ticket.owner.user_id === userId;
  const otherUser = isOwner ? ticket.sitter : ticket.owner;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-white rounded-xl overflow-hidden border">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-3 bg-white">
        <Button variant="ghost" size="icon" onClick={() => router.push("/app/chat")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Avatar>
          <AvatarImage src={otherUser.avatar_url || ""} />
          <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">{otherUser.name}</h2>
          <p className="text-xs text-neutral-500">{ticket.subject}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50">
        {messages.map((msg) => {
          const isMe = msg.sender_id === userId;
          return (
            <div
              key={msg.message_id}
              className={cn(
                "flex w-full max-w-[80%]",
                isMe ? "ml-auto justify-end" : "mr-auto"
              )}
            >
              <div
                className={cn(
                  "p-3 rounded-2xl text-sm break-words",
                  isMe
                    ? "bg-[#0ea5a4] text-white rounded-br-none"
                    : "bg-white border text-neutral-800 rounded-bl-none"
                )}
              >
                {msg.media_url && (
                  <div className="mb-2">
                    {msg.message_type === "image" ? (
                      <img
                        src={getMediaUrl(msg.media_thumbnail_url || msg.media_url)}
                        alt="attachment"
                        className="rounded-lg max-w-full max-h-[300px] object-cover cursor-pointer hover:opacity-95 transition-opacity"
                        onClick={() => setPreviewImage(getMediaUrl(msg.media_url))}
                      />
                    ) : (
                      <a
                        href={getMediaUrl(msg.media_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 underline"
                      >
                        <Paperclip className="w-4 h-4" />
                        Attachment
                      </a>
                    )}
                  </div>
                )}
                <p>{msg.text}</p>
                <div className={cn("text-[10px] mt-1 opacity-70", isMe ? "text-white" : "text-neutral-500")}>
                  {lang === "fa"
                    ? format(new Date(msg.created_at), "HH:mm")
                    : formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white flex items-center gap-2">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*,video/*,audio/*"
          onChange={handleFileUpload}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || sending}
        >
          {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5 text-neutral-500" />}
        </Button>
        <Input
          placeholder={t?.placeholder || "Type a message..."}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
          disabled={sending}
          className="flex-1"
        />
        <Button
          onClick={handleSendMessage}
          disabled={(!inputText.trim() && !uploading) || sending}
          className="bg-[#0ea5a4] hover:bg-[#0b7c7b]"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </div>

      <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
        <DialogContent className="max-w-3xl w-full p-0 overflow-hidden bg-transparent border-none shadow-none">
          <DialogTitle className="sr-only">Image Preview</DialogTitle>
          {previewImage && (
            <div className="relative flex items-center justify-center w-full h-full">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
