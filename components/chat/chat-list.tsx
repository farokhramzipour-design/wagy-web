"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { chatApi } from "@/services/chat-api";
import { TicketResponse } from "@/types/chat";
import { formatDistanceToNow } from "date-fns";
import { format } from "date-fns-jalali";
import { Loader2, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const content = { en, fa };

interface ChatListProps {
  token: string;
  userId: number;
}

export function ChatList({ token, userId }: ChatListProps) {
  const { lang } = useLanguage();
  const t = (content[lang] as any).dashboard.chat;
  const [tickets, setTickets] = useState<TicketResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await chatApi.getTickets(token, { scope: "all" });
        setTickets(response.items);
      } catch (error) {
        console.error("Failed to fetch tickets", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (tickets.length === 0) {
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
        {tickets.map((ticket) => {
          // Determine the other participant
          const isOwner = ticket.owner.user_id === userId;
          const otherUser = isOwner ? ticket.sitter : ticket.owner;
          const lastMessage = ticket.last_message;

          return (
            <Link key={ticket.ticket_id} href={`/app/chat/${ticket.ticket_id}`}>
              <div className="p-4 rounded-xl border bg-white hover:bg-neutral-50 transition-colors flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={otherUser.avatar_url || ""} />
                  <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <h3 className="font-semibold truncate">{otherUser.name}</h3>
                      {ticket.viewer_scope === "provider" && (
                        <span className="bg-[#0ea5a4]/10 text-[#0ea5a4] text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                          {t.providerRole}
                        </span>
                      )}
                    </div>
                    {lastMessage && (
                      <span className="text-xs text-neutral-500 whitespace-nowrap ml-2">
                        {lang === "fa"
                          ? format(new Date(lastMessage.at), "HH:mm")
                          : formatDistanceToNow(new Date(lastMessage.at), { addSuffix: true })}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-sm text-neutral-600 truncate max-w-[80%]">
                      {lastMessage?.text || (lastMessage?.type === 'image' ? t.imageSent : t.noMessages)}
                    </p>
                    {ticket.unread_count > 0 && (
                      <span className="bg-[#0ea5a4] text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                        {ticket.unread_count}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-neutral-400 mt-1">
                    {ticket.subject || `Booking #${ticket.booking_id}`}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
