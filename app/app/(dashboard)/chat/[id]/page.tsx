"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/language-provider";
import { chatApi } from "@/services/chat-api";
import { ConversationResponse, MessageResponse } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Send, Image as ImageIcon, ArrowLeft, Trash2 } from "lucide-react";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { format } from "date-fns-jalali";
import { cn } from "@/lib/utils";

const content = { en, fa };

export default function ChatDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { lang } = useLanguage();
  const t = (content[lang] as any).dashboard.chat;
  
  const [conversation, setConversation] = useState<ConversationResponse | null>(null);
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [inputText, setInputText] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // We need to fetch conversation details to show the header info
  useEffect(() => {
    const init = async () => {
      try {
        const [convList, msgList] = await Promise.all([
          chatApi.getConversations(),
          chatApi.getMessages(Number(id))
        ]);
        
        const currentConv = convList.find(c => c.conversation_id === Number(id));
        if (currentConv) {
          setConversation(currentConv);
        }
        
        // Reverse messages to show oldest first (if API returns newest first)
        // Usually chat APIs return newest first for pagination, but UI needs oldest at top
        setMessages(msgList.messages.reverse());
      } catch (error) {
        console.error("Failed to load chat", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      init();
    }
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    try {
      setSending(true);
      const newMessage = await chatApi.sendMessage(Number(id), { text: inputText });
      setMessages(prev => [...prev, newMessage]);
      setInputText("");
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-neutral-500">
        <p>Conversation not found</p>
        <Button variant="link" onClick={() => router.push('/app/chat')}>
          Back to list
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] -m-4 md:-m-8 bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-neutral-200 bg-white">
        <Button variant="ghost" size="icon" onClick={() => router.push('/app/chat')} className="md:hidden">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <Avatar>
          <AvatarImage src={conversation.other_user.avatar_url || undefined} />
          <AvatarFallback>{conversation.other_user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div>
          <h2 className="font-semibold">{conversation.other_user.name}</h2>
          {conversation.other_user.is_online && (
            <span className="text-xs text-green-500 font-medium">Online</span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-neutral-400 text-sm">
            {t.noMessages}
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id !== conversation.other_user.user_id;
            return (
              <div
                key={msg.message_id}
                className={cn(
                  "flex max-w-[80%]",
                  isMe ? "ml-auto justify-end" : "mr-auto justify-start"
                )}
              >
                <div
                  className={cn(
                    "p-3 rounded-2xl text-sm",
                    isMe
                      ? "bg-[#0ea5a4] text-white rounded-br-none"
                      : "bg-white border border-neutral-200 text-neutral-800 rounded-bl-none"
                  )}
                >
                  {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}
                  {msg.media_url && (
                    <img 
                      src={msg.media_url} 
                      alt="Shared image" 
                      className="max-w-full rounded-lg mt-1 max-h-[200px] object-cover"
                    />
                  )}
                  <div className={cn("text-[10px] mt-1 opacity-70", isMe ? "text-right" : "text-left")}>
                    {format(new Date(msg.created_at), "HH:mm")}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-neutral-200 bg-white">
        <div className="flex items-center gap-2">
          {/* Image Upload Button Placeholder - needs implementation with media API */}
          {/* <Button variant="ghost" size="icon" className="text-neutral-500" onClick={() => fileInputRef.current?.click()}>
            <ImageIcon className="w-5 h-5" />
          </Button> */}
          
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={t.placeholder}
            className="flex-1"
            disabled={sending}
          />
          
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputText.trim() || sending}
            className="bg-[#0ea5a4] hover:bg-[#0b7c7b]"
            size="icon"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
