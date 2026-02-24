import { apiFetch } from "@/lib/api-client";
import {
  InitiateChargeRequest,
  WalletBalanceResponse,
  WalletBookingPaymentResponse,
  WalletChargeCallbackResponse,
  WalletChargeInitiateResponse,
  WalletTransactionReason,
  WalletTransactionsResponse,
  WithdrawalCreateResponse,
  WithdrawalListItem,
  WithdrawRequest,
} from "@/types/wallet";

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
    return apiFetch<WalletBalanceResponse>("/api/v1/wallet/balance", {
      cache: "no-store",
      token,
    });
  },

  initiateCharge: async (data: InitiateChargeRequest, token?: string) => {
    return apiFetch<WalletChargeInitiateResponse>(
      "/api/v1/wallet/charge/initiate",
      {
        method: "POST",
        body: JSON.stringify(data),
        token,
      }
    );
  },

  getChargeCallback: async (authority: string, status: string, token?: string) => {
    const params = new URLSearchParams();
    params.append("Authority", authority);
    params.append("Status", status);

    return apiFetch<WalletChargeCallbackResponse>(
      `/api/v1/wallet/charge/callback?${params.toString()}`,
      { cache: "no-store", token }
    );
  },

  withdraw: async (data: WithdrawRequest, token?: string) => {
    return apiFetch<WithdrawalCreateResponse>("/api/v1/wallet/withdraw", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    });
  },

  getWithdrawals: async (
    skip: number = 0,
    limit: number = 20,
    token?: string
  ) => {
    const params = new URLSearchParams();
    params.append("skip", skip.toString());
    params.append("limit", limit.toString());

    return apiFetch<WithdrawalListItem[]>(
      `/api/v1/wallet/withdrawals?${params.toString()}`,
      { cache: "no-store", token }
    );
  },

  payBooking: async (bookingId: number, token?: string) => {
    return apiFetch<WalletBookingPaymentResponse>(
      `/api/v1/wallet/bookings/${bookingId}/pay`,
      { method: "POST", token }
    );
  },
};
