"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface WalletCallbackResultProps {
  success: boolean;
  message: string;
  t: any;
}

export function WalletCallbackResult({ success, message, t }: WalletCallbackResultProps) {
  const router = useRouter();

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push("/app/wallet");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      {success ? (
        <>
          <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
            <svg
              className="h-6 w-6 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-emerald-600">{t.paymentSuccessful}</h1>
          <p className="text-neutral-600">{message}</p>
          <p className="text-sm text-neutral-500">{t.redirectingToWallet}</p>
          <Button asChild className="mt-4">
            <Link href="/app/wallet">{t.returnToWallet}</Link>
          </Button>
        </>
      ) : (
        <>
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-red-600">{t.paymentFailed}</h1>
          <p className="text-neutral-600">{message}</p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/app/wallet">{t.returnToWallet}</Link>
          </Button>
        </>
      )}
    </div>
  );
}
