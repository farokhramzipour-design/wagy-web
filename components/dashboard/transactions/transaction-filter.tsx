"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { WalletTransactionReason } from "@/types/wallet";

interface TransactionFilterProps {
  t: any;
  lang: string;
}

const REASONS: WalletTransactionReason[] = [
  "wallet_charge",
  "booking_refund",
  "charity_donation",
  "payout_received",
  "promo_credit",
  "admin_adjustment",
  "booking_payment",
  "withdrawal",
];

export function TransactionFilter({ t, lang }: TransactionFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentReason = searchParams.get("reason") || "all";
  const isRtl = lang === "fa";

  const handleReasonChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("reason");
    } else {
      params.set("reason", value);
    }
    params.set("page", "1"); // Reset to page 1
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="mb-4 w-full md:w-[250px]">
      <Select value={currentReason} onValueChange={handleReasonChange} dir={isRtl ? "rtl" : "ltr"}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t.filter?.placeholder || "Filter by reason"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t.filter?.all || "All Transactions"}</SelectItem>
          {REASONS.map((reason) => (
            <SelectItem key={reason} value={reason}>
              {t.reasons[reason]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
