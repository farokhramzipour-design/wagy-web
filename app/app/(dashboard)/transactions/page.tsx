import { PaginationControls } from "@/components/dashboard/transactions/pagination-controls";
import { TransactionFilter } from "@/components/dashboard/transactions/transaction-filter";
import { TransactionList } from "@/components/dashboard/transactions/transaction-list";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { walletApi } from "@/services/wallet-api";
import { WalletTransaction, WalletTransactionReason } from "@/types/wallet";
import { CreditCard } from "lucide-react";
import { cookies } from "next/headers";

const content = { en, fa };
const ITEMS_PER_PAGE = 20;

interface TransactionsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function TransactionsPage({ searchParams }: TransactionsPageProps) {
  const cookieStore = cookies();
  const lang = (cookieStore.get("waggy_lang")?.value as "en" | "fa") || "en";
  const t = content[lang].dashboard.transactions;

  const page = typeof searchParams.page === "string" ? parseInt(searchParams.page) : 1;
  const reason = typeof searchParams.reason === "string" ? (searchParams.reason as WalletTransactionReason) : undefined;

  const skip = (page - 1) * ITEMS_PER_PAGE;
  // Fetch one extra item to check if there is a next page
  const limit = ITEMS_PER_PAGE + 1;

  let transactions: WalletTransaction[] = [];
  let hasMore = false;
  let error = null;

  const token = cookieStore.get("waggy_access_token")?.value;

  try {
    const response = await walletApi.getTransactions(skip, limit, reason, token);
    if (response && response.transactions) {
      if (response.transactions.length > ITEMS_PER_PAGE) {
        hasMore = true;
        transactions = response.transactions.slice(0, ITEMS_PER_PAGE);
      } else {
        transactions = response.transactions;
      }
    }
  } catch (err) {
    console.error("Failed to fetch transactions", err);
    error = err;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-neutral-800">{t.title}</h1>
        <TransactionFilter t={t} lang={lang} />
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
          {lang === "fa" ? "خطا در بارگیری تراکنش‌ها. لطفا دوباره تلاش کنید." : "Error loading transactions. Please try again later."}
        </div>
      ) : (
        <>
          {transactions.length === 0 ? (
            <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center">
              <div className="mx-auto w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6 text-neutral-400" />
              </div>
              <p className="text-neutral-500">{t.empty}</p>
            </div>
          ) : (
            <>
              <TransactionList transactions={transactions} t={t} lang={lang} />
              {(transactions.length > 0 || page > 1) && (
                <PaginationControls hasMore={hasMore} t={t} lang={lang} />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
