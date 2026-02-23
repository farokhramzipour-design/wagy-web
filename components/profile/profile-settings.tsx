"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SessionData } from "@/lib/session";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { ProfileCompletionResponse, ProfileMeResponse } from "@/services/profile-api";
import { useMemo } from "react";
import { ContactInfoForm } from "./contact-info-form";
import { BasicInfoForm } from "./basic-info-form";

const content = { en, fa };

interface ProfileSettingsProps {
  completion: ProfileCompletionResponse | null;
  user: SessionData | null;
  profile: ProfileMeResponse | null;
  accessToken?: string;
}

export function ProfileSettings({ completion, user, profile, accessToken }: ProfileSettingsProps) {
  const { lang } = useLanguage();
  const t = useMemo(() => content[lang], [lang]);
  const tProfile = t.profile;

  if (!completion || !profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{tProfile.pageTitle}</h1>
        <p className="text-muted-foreground">
          {user?.name}, {tProfile.completeProfile}
        </p>
      </div>

      {!completion.is_complete && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>{tProfile.status}</CardTitle>
              <Badge variant="warning">
                {tProfile.incomplete}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-muted-foreground">{tProfile.completion}</span>
                <span className="font-bold">{completion.completion_percentage}%</span>
              </div>
              <Progress value={completion.completion_percentage} className="h-3" />
            </div>
          </CardContent>
        </Card>
      )}

      <BasicInfoForm profile={profile} accessToken={accessToken} />
      <ContactInfoForm profile={profile} completion={completion} />
    </div>
  );
}
