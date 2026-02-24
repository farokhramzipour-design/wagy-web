import { WalletDashboard } from "@/components/wallet/wallet-dashboard";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { walletApi } from "@/services/wallet-api";
import { cookies } from "next/headers";

const content = { en, fa };

export default async function WalletPage() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("waggy_access_token")?.value;
  const lang = (cookieStore.get("waggy_lang")?.value as "en" | "fa") || "en";
  const t = content[lang].wallet;

  let balance = 0;
  let transactions: any[] = [];

  if (accessToken) {
    const [balanceResult, transactionsResult] = await Promise.allSettled([
      walletApi.getBalance(accessToken),
      walletApi.getTransactions(0, 20, undefined, accessToken),
    ]);

    if (balanceResult.status === "fulfilled") {
      balance = balanceResult.value.balance_minor;
    } else {
      console.error("Failed to fetch wallet balance", balanceResult.reason);
    }

    if (transactionsResult.status === "fulfilled") {
      transactions = transactionsResult.value.transactions;
    } else {
      console.error("Failed to fetch transactions", transactionsResult.reason);
    }
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{t.title}</h2>
      </div>
      <WalletDashboard
        balance={balance}
        transactions={transactions}
        t={t}
        lang={lang}
      />
    </div>
  );
}
