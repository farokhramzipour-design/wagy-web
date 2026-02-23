"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { ProfileCompletionResponse, ProfileMeResponse } from "@/services/profile-api";
import { AlertCircle, ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

const content = { en, fa };

interface ContactInfoFormProps {
  profile: ProfileMeResponse;
  completion: ProfileCompletionResponse | null;
}

export function ContactInfoForm({ profile, completion }: ContactInfoFormProps) {
  const { lang } = useLanguage();
  const t = useMemo(() => content[lang], [lang]);
  const tContact = t.profile.contactInfo;

  const isPhoneMissing = completion?.missing_fields.includes("phone");
  const isEmailMissing = completion?.missing_fields.includes("email");
  // Assuming 'address' is the field name for address in missing_fields
  const isAddressMissing = completion?.missing_fields.includes("address");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tContact.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Phone Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{tContact.phone}</span>
            </div>
            {profile.phone_e164 && (
              <Badge variant={profile.phone_verified ? "success" : "warning"}>
                {profile.phone_verified ? tContact.verified : tContact.unverified}
              </Badge>
            )}
          </div>

          {isPhoneMissing ? (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">
                {/* You might want a localized string here for "No phone number added" */}
              </p>
              <Button asChild variant="outline" className="w-full sm:w-auto justify-start">
                <Link href="/app/profile/phone">
                  {tContact.addPhone}
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 border rounded-md bg-muted/20">
              <span className="font-mono text-sm">{profile.phone_e164}</span>
              <Button asChild variant="ghost" size="sm">
                <Link href="/app/profile/phone">
                  {tContact.editPhone}
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Email Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{tContact.email}</span>
            </div>
            {profile.email && (
              <Badge variant={profile.email_verified ? "success" : "warning"}>
                {profile.email_verified ? tContact.verified : tContact.unverified}
              </Badge>
            )}
          </div>

          {isEmailMissing ? (
            <div className="flex flex-col gap-2">
              <Button asChild variant="outline" className="w-full sm:w-auto justify-start">
                <Link href="/app/profile/email">
                  {tContact.addEmail}
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 border rounded-md bg-muted/20">
              <span className="text-sm">{profile.email}</span>
              <Button asChild variant="ghost" size="sm">
                <Link href="/app/profile/email">
                  {tContact.editEmail}
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Address Section */}
        {isAddressMissing && (
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{tContact.address}</span>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-3 w-full">
                  <p className="text-sm text-amber-800">
                    {tContact.addressMissing}
                  </p>
                  <Button asChild variant="outline" size="sm" className="bg-white hover:bg-amber-50 border-amber-300 text-amber-900 hover:text-amber-950">
                    <Link href="/app/addresses" className="flex items-center gap-2">
                      {tContact.goToAddresses}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
