"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { payBooking } from "@/services/booking-api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface PayButtonProps {
  bookingId: number;
  token: string;
  t: any;
}

export function PayButton({ bookingId, token, t }: PayButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      await payBooking(token, bookingId);
      toast.success(t.details.paymentSuccess || "Payment successful");
      router.refresh();
    } catch (error) {
      console.error("Failed to pay booking", error);
      toast.error(t.details.paymentError || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handlePay} disabled={loading}>
      {loading ? "Processing..." : t.details.actions.pay}
    </Button>
  );
}
