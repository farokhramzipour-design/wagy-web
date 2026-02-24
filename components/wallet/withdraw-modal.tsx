"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface WithdrawModalProps {
  t: any;
  lang: string;
}

export function WithdrawModal({ t, lang }: WithdrawModalProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleWithdraw = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error(t.invalidAmount);
      return;
    }
    if (!bankName || !accountNumber || !accountName) {
      toast.error(t.fillRequired);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/v1/wallet/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount_minor: Number(amount),
          bank_name: bankName,
          bank_account_number: accountNumber,
          bank_account_name: accountName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t.withdrawFailed);
      }

      if (data && data.status === "pending") {
        toast.success(data.message || t.withdrawalRequestSubmitted);
        setOpen(false);
        router.refresh();
      } else {
        toast.error(t.withdrawFailed);
      }
    } catch (error: any) {
      console.error("Withdraw error:", error);
      toast.error(error.message || t.withdrawFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
          {t.withdraw}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.withdraw}</DialogTitle>
          <DialogDescription>
            {t.withdrawDescription}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="withdraw-amount">{t.amount} (IRR)</Label>
            <Input
              id="withdraw-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100000"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bank-name">{t.bankName}</Label>
            <Input
              id="bank-name"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder={t.bankNamePlaceholder || "Bank Melli"}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="account-number">{t.accountNumber}</Label>
            <Input
              id="account-number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="1234567890123456"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="account-name">{t.accountName}</Label>
            <Input
              id="account-name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder={t.accountNamePlaceholder || "John Doe"}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            {t.cancel}
          </Button>
          <Button onClick={handleWithdraw} disabled={loading} className="bg-red-600 hover:bg-red-700 text-white">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
