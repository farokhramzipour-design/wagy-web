import { apiFetch } from "@/lib/api-client";
import { WalletTransactionsResponse, WalletTransactionReason, WalletBalanceResponse } from "@/types/wallet";

export const walletApi = {
  getTransactions: async (
    skip: number = 0,
    limit: number = 20,
    reason?: WalletTransactionReason,
    token?: string
  ) => {
    const params = new URLSearchParams();
    params.append("skip", skip.toString());
    params.append("limit", limit.toString());
    if (reason) params.append("reason", reason);

    return apiFetch<WalletTransactionsResponse>(
      `/api/v1/wallet/transactions?${params.toString()}`,
      { cache: "no-store", token }
    );
  },

  getBalance: async (token?: string) => {
    return apiFetch<WalletBalanceResponse>("/api/v1/wallet/balance", { cache: "no-store", token });
  }
};
