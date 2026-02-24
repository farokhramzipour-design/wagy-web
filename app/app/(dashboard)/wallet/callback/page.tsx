import { WalletCallbackResult } from "@/components/wallet/wallet-callback-result";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { walletApi } from "@/services/wallet-api";
import { cookies } from "next/headers";

const content = { en, fa };

interface WalletCallbackPageProps {
  searchParams: {
    Authority?: string;
    Status?: string;
  };
}

export default async function WalletCallbackPage({ searchParams }: WalletCallbackPageProps) {
  const cookieStore = cookies();
  const token = cookieStore.get("waggy_access_token")?.value;
  const lang = (cookieStore.get("waggy_lang")?.value as "en" | "fa") || "en";
  const t = content[lang].wallet;

  const authority = searchParams.Authority;
  const status = searchParams.Status;

  let success = false;
  let message = t.paymentFailed;

  if (!authority || !status) {
    message = t.invalidPaymentParameters;
  } else if (!token) {
    message = t.authenticationRequired;
  } else {
    try {
      const response = await walletApi.getChargeCallback(authority, status, token);
      success = response.success;
      // Use the message from API if available, otherwise fallback to generic success/failure message
      // Note: API might return English message, but for now we prioritize API message if it exists
      // Ideally API should return error codes to translate, but we'll use t defaults if message is generic
      message = response.message || (success ? t.paymentSuccessful : t.paymentFailed);
    } catch (error) {
      console.error("Payment verification failed", error);
      message = t.paymentVerificationFailed;
    }
  }

  return <WalletCallbackResult success={success} message={message} t={t} />;
}
