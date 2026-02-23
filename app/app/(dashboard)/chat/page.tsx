"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";
import { chatApi } from "@/services/chat-api";
import { ConversationResponse } from "@/types/chat";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, MessageSquare } from "lucide-react";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { formatDistanceToNow } from "date-fns";
import { format } from "date-fns-jalali";

const content = { en, fa };

export default function ChatListPage() {
  const { lang } = useLanguage();
  const t = (content[lang] as any).dashboard.chat;
  const [conversations, setConversations] = useState<ConversationResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await chatApi.getConversations();
        setConversations(data);
      } catch (error) {
        console.error("Failed to fetch conversations", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-neutral-500 space-y-4">
        <MessageSquare className="w-12 h-12 opacity-50" />
        <p>{t.empty}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t.title}</h1>
      </div>

      <div className="grid gap-4">
        {conversations.map((conversation) => (
          <Link key={conversation.conversation_id} href={`/app/chat/${conversation.conversation_id}`}>
            <Card className="p-4 hover:bg-neutral-50 transition-colors cursor-pointer">
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={conversation.other_user.avatar_url || undefined} />
                  <AvatarFallback>{conversation.other_user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold truncate">{conversation.other_user.name}</h3>
                    {conversation.last_message?.at && (
                      <span className="text-xs text-neutral-500 whitespace-nowrap">
                        {lang === 'fa' 
                          ? format(new Date(conversation.last_message.at), "yyyy/MM/dd HH:mm")
                          : formatDistanceToNow(new Date(conversation.last_message.at), { addSuffix: true })
                        }
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-neutral-600 truncate">
                      {conversation.last_message?.text || (conversation.last_message?.type === 'image' ? 'Image' : '')}
                    </p>
                    {conversation.unread_count > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                        {conversation.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
