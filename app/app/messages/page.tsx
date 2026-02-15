"use client";

import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageTitle } from "@/components/layout/page-title";
import { useChatsQuery } from "@/services/marketplace-service";

export default function MessagesPage() {
  const { t } = useTranslation();
  const { data } = useChatsQuery();

  return (
    <div>
      <PageTitle title={t("app.messages.title")} description={t("app.messages.empty")} />
      <div className="space-y-3">
        {data?.map((chat) => (
          <Card key={chat.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{chat.contactName}</p>
                <p className="text-sm text-muted-foreground">{t(`mocks.chatMessages.${chat.lastMessage}`)}</p>
              </div>
              {chat.unread > 0 ? <Badge>{chat.unread}</Badge> : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
