"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { WalletTransaction } from "@/types/wallet";
import { Wallet } from "lucide-react";
import Link from "next/link";
import { ChargeModal } from "./charge-modal";
import { TransactionHistory } from "./transaction-history";
import { WithdrawModal } from "./withdraw-modal";

interface WalletDashboardProps {
  balance: number;
  transactions: WalletTransaction[];
  t: any;
  lang: string;
}

export function WalletDashboard({ balance, transactions, t, lang }: WalletDashboardProps) {
  const locale = lang === "fa" ? "fa-IR" : "en-US";

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t.balance}
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {formatPrice(balance, "IRR", locale)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t.availableBalance}
            </p>
          </CardContent>
        </Card>
        <Card className="flex flex-col justify-center p-6 gap-4">
          <ChargeModal t={t} lang={lang} />
          <WithdrawModal t={t} lang={lang} />
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">{t.transactions}</h2>
          <Button variant="ghost" asChild>
            <Link href="/app/transactions">
              {t.viewAll}
            </Link>
          </Button>
        </div>
        <TransactionHistory transactions={transactions} t={t} lang={lang} />
      </div>
    </div>
  );
}
