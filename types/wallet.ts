export type WalletTransactionReason =
    | "wallet_charge"
    | "booking_refund"
    | "charity_donation"
    | "payout_received"
    | "promo_credit"
    | "admin_adjustment"
    | "booking_payment"
    | "withdrawal";

export interface WalletTransaction {
    wallet_tx_id: number;
    amount_minor: number;
    reason: WalletTransactionReason;
    description: string;
    balance_after_minor: number;
    related_booking_id: number | null;
    related_payment_id: number | null;
    created_at: string;
}

export interface WalletTransactionsResponse {
    balance_minor: number;
    transactions: WalletTransaction[];
}

export interface WalletBalanceResponse {
    wallet_id: number;
    balance_minor: number;
    currency_code: string;
    is_frozen: boolean;
}
