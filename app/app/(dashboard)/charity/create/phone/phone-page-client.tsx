"use client";

import { PhoneStep } from "@/components/dashboard/become-sitter/steps/phone-step";
import { useLanguage } from "@/components/providers/language-provider";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";

const content = { en, fa };

interface CharityPhonePageClientProps {
  token: string;
}

export function CharityPhonePageClient({ token }: CharityPhonePageClientProps) {
  return (
    <div className="container mx-auto py-8">
      <PhoneStep 
        token={token} 
        redirectPath="/app/charity/create" 
      />
    </div>
  );
}
