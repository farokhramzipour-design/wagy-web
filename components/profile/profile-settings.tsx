"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SessionData } from "@/lib/session";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { ProfileCompletionResponse, ProfileMeResponse } from "@/services/profile-api";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useMemo } from "react";
import { BasicInfoForm } from "./basic-info-form";
import { ContactInfoForm } from "./contact-info-form";

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

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>{tProfile.status}</CardTitle>
            <Badge variant={completion.is_complete ? "success" : "warning"}>
              {completion.is_complete ? tProfile.complete : tProfile.incomplete}
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

          <div className="grid md:grid-cols-2 gap-6 pt-4">
            {/* Completed Fields */}
            <div className="space-y-3">
              <h3 className="font-medium flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                {tProfile.completedFields}
              </h3>
              <div className="bg-green-50/50 rounded-lg p-4 border border-green-100">
                {completion.completed_fields.length > 0 ? (
                  <ul className="space-y-2">
                    {completion.completed_fields.map((field) => (
                      <li key={field} className="text-sm text-green-700 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                        {field}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No fields completed yet.</p>
                )}
              </div>
            </div>

            {/* Missing Fields */}
            <div className="space-y-3">
              <h3 className="font-medium flex items-center gap-2 text-amber-600">
                <AlertCircle className="h-5 w-5" />
                {tProfile.missingFields}
              </h3>
              <div className="bg-amber-50/50 rounded-lg p-4 border border-amber-100">
                {completion.missing_fields.length > 0 ? (
                  <ul className="space-y-2">
                    {completion.missing_fields.map((field) => (
                      <li key={field} className="text-sm text-amber-700 flex items-center gap-2">
                        <XCircle className="h-4 w-4 shrink-0" />
                        {field}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-green-600 font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    All set! Profile is complete.
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <BasicInfoForm profile={profile} accessToken={accessToken} />
      <ContactInfoForm profile={profile} completion={completion} />
    </div>
  );
}
