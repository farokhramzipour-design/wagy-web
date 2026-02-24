"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface PayButtonProps {
  bookingId: number;
  token?: string;
  t: any;
}

export function PayButton({ bookingId, t }: PayButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/wallet/bookings/${bookingId}/pay`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t.details?.paymentError || "Payment failed");
      }

      toast.success(data.message || t.details?.paymentSuccess || "Payment successful");
      router.refresh();
    } catch (error: any) {
      console.error("Failed to pay booking", error);
      toast.error(error.message || t.details?.paymentError || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handlePay} disabled={loading} className="w-full">
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t.details?.actions?.processing || "Processing..."}
        </>
      ) : (
        t.details?.actions?.pay || "Pay Now"
      )}
    </Button>
  );
}
