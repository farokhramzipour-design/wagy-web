"use client";

import { AddressStep } from "@/components/dashboard/become-sitter/steps/address-step";
import { useLanguage } from "@/components/providers/language-provider";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";

const content = { en, fa };

export default function CharityAddressPage() {
  return (
    <div className="container mx-auto py-8">
      <AddressStep 
        redirectPath="/app/charity/create" 
      />
    </div>
  );
}
