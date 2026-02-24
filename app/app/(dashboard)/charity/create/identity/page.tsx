"use client";

import { IdentityStep } from "@/components/dashboard/become-sitter/steps/identity-step";
import { useLanguage } from "@/components/providers/language-provider";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";

const content = { en, fa };

export default function CharityIdentityPage() {
  return (
    <div className="container mx-auto py-8">
      <IdentityStep 
        redirectPath="/app/charity/create" 
      />
    </div>
  );
}
