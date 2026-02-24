"use client";

import { useLanguage } from "@/components/providers/language-provider";
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
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { charityPublicApi } from "@/services/charity-public-api";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const content = { en, fa };

interface DonationDialogProps {
  caseId: number;
  caseTitle: string;
  currency?: string;
  isLoggedIn: boolean;
}

export function DonationDialog({ caseId, caseTitle, currency = "IRR", isLoggedIn }: DonationDialogProps) {
  const { lang } = useLanguage();
  const t = (content[lang] as any).charity;
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const predefinedAmounts = [500000, 1000000, 2000000, 5000000];

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      // Check login status
      if (!isLoggedIn) {
        toast.error(t.loginToDonate);
        router.push(`/auth?next=${pathname}`);
        return;
      }
    }
    setOpen(newOpen);
  };

  const handleDonate = async () => {
    const value = parseInt(amount.replace(/,/g, ""), 10);
    if (!value || value <= 0) {
      return;
    }

    try {
      setLoading(true);
      await charityPublicApi.donate({
        charity_case_id: caseId,
        amount_minor: value,
        currency_code: currency,
      });
      toast.success(t.donationDialog.success);
      setOpen(false);
      setAmount("");
      // Refresh page or data? ideally refresh data
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(t.donationDialog.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
          {t.donate}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.donationDialog.title}</DialogTitle>
          <DialogDescription>
            {caseTitle}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {predefinedAmounts.map((amt) => (
              <Button
                key={amt}
                variant={amount === amt.toString() ? "default" : "outline"}
                onClick={() => setAmount(amt.toString())}
                className="flex-1 min-w-[100px]"
              >
                {new Intl.NumberFormat(lang === "fa" ? "fa-IR" : "en-US").format(amt)}
              </Button>
            ))}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">{t.donationDialog.customAmount}</Label>
            <div className="relative">
              <Input
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="pl-4"
                type="number"
              />
              <span className="absolute right-3 top-2.5 text-sm text-neutral-500">
                {currency}
              </span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleDonate} disabled={loading || !amount} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? t.donationDialog.processing : t.donationDialog.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
