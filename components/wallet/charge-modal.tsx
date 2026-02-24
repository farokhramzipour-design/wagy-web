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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ChargeModalProps {
  t: any;
  lang: string;
}

export function ChargeModal({ t, lang }: ChargeModalProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"zarinpal" | "bank_transfer">("zarinpal");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCharge = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error(t.invalidAmount);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/v1/wallet/charge/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount_minor: Number(amount),
          method,
          currency_code: "IRR",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t.chargeFailed);
      }

      if (data && data.payment_url) {
        window.location.href = data.payment_url;
      } else if (data && data.message) {
        toast.success(data.message);
        setOpen(false);
        router.refresh();
      } else {
        toast.error(t.chargeFailed);
      }
    } catch (error: any) {
      console.error("Charge error:", error);
      toast.error(error.message || t.chargeFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
          {t.charge}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.charge}</DialogTitle>
          <DialogDescription>
            {t.chargeDescription}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">{t.amount} (IRR)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100000"
            />
          </div>
          <div className="grid gap-2">
            <Label>{t.method}</Label>
            <RadioGroup
              value={method}
              onValueChange={(value) =>
                setMethod(value as "zarinpal" | "bank_transfer")
              }
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="zarinpal" id="zarinpal" />
                <Label htmlFor="zarinpal">{t.zarinpal}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bank_transfer" id="bank-transfer" />
                <Label htmlFor="bank-transfer">{t.bankTransfer}</Label>
              </div>
            </RadioGroup>
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
          <Button onClick={handleCharge} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
