"use client";

import { DocumentsStep } from "@/components/dashboard/become-sitter/steps/documents-step";
import { useLanguage } from "@/components/providers/language-provider";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { VerificationStatusResponse } from "@/services/verification-api";

const content = { en, fa };

interface CharityDocumentsPageClientProps {
  status: VerificationStatusResponse;
}

export function CharityDocumentsPageClient({ status }: CharityDocumentsPageClientProps) {
  return (
    <div className="container mx-auto py-8">
      <DocumentsStep 
        status={status} 
        redirectPath="/app/charity/create" 
      />
    </div>
  );
}
