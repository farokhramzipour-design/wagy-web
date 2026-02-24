
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

export interface InitiateChargeRequest {
    amount_minor: number;
    method: "zarinpal" | "bank_transfer";
    currency_code: string;
}

export interface BankDetails {
    bank_name: string;
    account_number: string;
    account_name: string;
    amount_minor: number;
    reference: string;
}

export interface WalletChargeInitiateResponse {
    charge_id: number;
    charge_reference: string;
    method: "zarinpal" | "bank_transfer";
    payment_url?: string; // For zarinpal
    message?: string; // For bank_transfer
    bank_details?: BankDetails; // For bank_transfer
}

export interface WalletChargeCallbackResponse {
    success: boolean;
    ref_id?: string;
    new_balance_minor?: number;
    message?: string;
}

export interface WithdrawRequest {
    amount_minor: number;
    bank_account_name: string;
    bank_account_number: string;
    bank_name: string;
}

export interface WithdrawalCreateResponse {
    withdrawal_id: number;
    amount_minor: number;
    status: string;
    estimated_days: number;
    message: string;
}

export interface WithdrawalListItem {
    withdrawal_id: number;
    amount_minor: number;
    status: "pending" | "approved" | "completed" | "rejected" | "cancelled";
    bank_account_number: string;
    created_at: string;
    completed_at: string | null;
}

export interface WalletBookingPaymentResponse {
    booking_id: number;
    subtotal_minor: number;
    app_fee_minor: number;
    provider_payout_minor: number;
    fee_rate_bps: number;
    message: string;
}
