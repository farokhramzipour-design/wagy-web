"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WalletTransaction } from "@/types/wallet";
import { formatPrice } from "@/lib/utils";
import { CreditCard } from "lucide-react";

interface TransactionListProps {
  transactions: WalletTransaction[];
  t: any;
  lang: string;
}

export function TransactionList({ transactions, t, lang }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center">
        <div className="mx-auto w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
          <CreditCard className="w-6 h-6 text-neutral-400" />
        </div>
        <p className="text-neutral-500">{t.empty}</p>
      </div>
    );
  }

  const locale = lang === "fa" ? "fa-IR" : "en-US";

  return (
    <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">{t.list.id}</TableHead>
            <TableHead>{t.list.date}</TableHead>
            <TableHead>{t.list.amount}</TableHead>
            <TableHead>{t.list.reason}</TableHead>
            <TableHead className="hidden md:table-cell">{t.list.description}</TableHead>
            <TableHead className="text-right">{t.list.balance}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.wallet_tx_id}>
              <TableCell className="font-medium">#{tx.wallet_tx_id}</TableCell>
              <TableCell>
                {new Date(tx.created_at).toLocaleDateString(locale, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </TableCell>
              <TableCell className={tx.amount_minor > 0 ? "text-green-600 dir-ltr" : "text-red-600 dir-ltr"}>
                {formatPrice(tx.amount_minor, "IRR", locale)}
              </TableCell>
              <TableCell>
                {t.reasons[tx.reason] || tx.reason}
              </TableCell>
              <TableCell className="hidden md:table-cell text-neutral-500">
                {tx.description}
              </TableCell>
              <TableCell className="text-right dir-ltr">
                {formatPrice(tx.balance_after_minor, "IRR", locale)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
