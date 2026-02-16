"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/layout/page-hero";
import { queryKeys } from "@/lib/queries";
import { useAppTranslation } from "@/lib/use-app-translation";
import { fetchChats } from "@/services/query-service";

export default function MessagesPage() {
  const { t } = useAppTranslation();
  const { data } = useQuery({ queryKey: queryKeys.chats, queryFn: fetchChats });

  return (
    <>
      <PageHero title={t("app.sidebar.messages")} subtitle={t("app.pages.messagesSubtitle")} />
      <div className="grid gap-3">
        {data?.map((chat) => (
          <Card key={chat.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span>{chat.name}</span>
                {chat.unread > 0 ? <Badge>{chat.unread}</Badge> : null}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
              <p>{chat.lastMessage}</p>
              <p>{chat.time}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
