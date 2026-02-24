# Frontend Integration Doc: Finance and Wallet (Complete)

This document is for implementing all finance and wallet UI flows against current backend behavior.

Base API prefix: `/api/v1`

## 1) Scope

Included:

- User wallet balance and ledger
- Wallet top-up (Zarinpal and bank transfer)
- Wallet top-up callback handling
- Withdrawal request and history
- Booking payment from wallet
- Admin finance configuration
- Admin wallet charge confirmations
- Admin withdrawal approval/rejection
- Admin transaction explorer and wallet controls

Excluded:

- Charity payment flows
- Booking lifecycle UI details (covered in booking doc)

## 2) Money Conventions

- Amount fields ending with `_minor` are integer minor units.
- Currency is effectively `IRR` everywhere in wallet flows.
- Frontend should treat all `_minor` values as integer money and format for display.

## 3) Enum Values (Exact)

### `WalletTransactionReason`

- `wallet_charge`
- `booking_refund`
- `charity_donation`
- `payout_received`
- `promo_credit`
- `admin_adjustment`
- `booking_payment`
- `withdrawal`

### `WalletChargeStatus`

- `pending`
- `succeeded`
- `failed`
- `refunded`

### `WithdrawalStatus`

- `pending`
- `approved`
- `completed`
- `rejected`
- `cancelled`

### `PaymentStatus`

- `pending`
- `processing`
- `completed`
- `captured`
- `paid_out`
- `failed`
- `refunded`
- `partial_refund`

### `PaymentKind`

- `capture`
- `payout`
- `refund`
- `charity_donation`
- `wallet_charge`
- `withdrawal`

## 4) User Wallet APIs

All wallet endpoints require authenticated user.

## 4.1 Get Wallet Balance

Endpoint:

- `GET /wallet/balance`

Behavior:

- Auto-creates wallet if missing.

Response (`WalletBalanceResponse`):

```json
{
  "wallet_id": 12,
  "balance_minor": 2500000,
  "currency_code": "IRR",
  "is_frozen": false
}
```

## 4.2 Get Wallet Transactions

Endpoint:

- `GET /wallet/transactions`

Query params:

- `skip` default `0`, min `0`
- `limit` default `20`, min `1`, max `100`
- `reason` optional (`WalletTransactionReason` value string)

Behavior:

- If `reason` is invalid, returns `400` with `Invalid reason filter`.
- Sorted descending by `created_at`.

Response (`WalletTransactionsResponse`):

```json
{
  "balance_minor": 2500000,
  "transactions": [
    {
      "wallet_tx_id": 901,
      "amount_minor": -300000,
      "reason": "booking_payment",
      "description": "Booking #501 payment",
      "balance_after_minor": 2200000,
      "related_booking_id": 501,
      "related_payment_id": 7001,
      "created_at": "2026-02-23T12:10:00Z"
    }
  ]
}
```

## 4.3 Initiate Wallet Charge

Endpoint:

- `POST /wallet/charge/initiate`

Request (`InitiateChargeRequest`):

```json
{
  "amount_minor": 1000000,
  "method": "zarinpal",
  "currency_code": "IRR"
}
```

Validation and config rules:

- `amount_minor` > 0
- `method` must be `zarinpal` or `bank_transfer`
- `currency_code` length 3 (backend uppercases it)
- Method can be globally disabled by finance config.
- `amount_minor` must be <= `single_charge_max_minor`.
- `wallet.balance + amount_minor` must be <= `wallet_max_balance_minor`.

Zarinpal response (`WalletChargeInitiateResponse`):

```json
{
  "charge_id": 22,
  "charge_reference": "CHG-1A2B3C4D5E6F7A8B",
  "method": "zarinpal",
  "payment_url": "https://www.zarinpal.com/pg/StartPay/..."
}
```

Bank-transfer response (`WalletChargeInitiateResponse`):

```json
{
  "charge_id": 23,
  "charge_reference": "CHG-9F8E7D6C5B4A3210",
  "method": "bank_transfer",
  "message": "Transfer amount to the provided bank account and wait for admin confirmation.",
  "bank_details": {
    "bank_name": "Bank Mellat",
    "account_number": "1234-5678-9012-3456",
    "account_name": "Pet Care Marketplace",
    "amount_minor": 1000000,
    "reference": "CHG-9F8E7D6C5B4A3210"
  }
}
```

Notes:

- Bank transfer charge remains `pending` until admin confirms.
- Bank details are currently static values returned by backend.

## 4.4 Wallet Charge Callback (Gateway Redirect)

Endpoint:

- `GET /wallet/charge/callback?Authority=...&Status=OK`

Response (`WalletChargeCallbackResponse`) success:

```json
{
  "success": true,
  "ref_id": "123456789",
  "new_balance_minor": 3500000
}
```

Possible other responses:

```json
{
  "success": true,
  "message": "Already processed",
  "new_balance_minor": 3500000
}
```

```json
{
  "success": false,
  "message": "Payment cancelled"
}
```

```json
{
  "success": false,
  "message": "Verification failed"
}
```

Error cases:

- `404`: `Charge not found`

Callback integration note:

- This endpoint signature expects query keys named `Authority` and `Status` (capitalized).

## 4.5 Request Withdrawal

Endpoint:

- `POST /wallet/withdraw`

Request (`WithdrawRequest`):

```json
{
  "amount_minor": 1500000,
  "bank_account_name": "Sajjad Doodabi",
  "bank_account_number": "6037991234567890",
  "bank_name": "Mellat"
}
```

Validation and rules:

- `amount_minor` > 0 and must be >= `withdrawal_min_amount_minor` from config.
- Wallet is debited immediately at request time.
- If wallet is frozen, returns `403`.
- If insufficient funds, returns `400`.
- Creates withdrawal record with `pending` status.
- Also marks/creates `BANK_ACCOUNT` verification as `passed` for user.

Response (`WithdrawalCreateResponse`):

```json
{
  "withdrawal_id": 77,
  "amount_minor": 1500000,
  "status": "pending",
  "estimated_days": 2,
  "message": "Withdrawal request submitted. Processing in 2 business days."
}
```

## 4.6 List My Withdrawals

Endpoint:

- `GET /wallet/withdrawals`

Query params:

- `skip` default `0`, min `0`
- `limit` default `20`, min `1`, max `50`

Response (array of `WithdrawalListItemResponse`):

```json
[
  {
    "withdrawal_id": 77,
    "amount_minor": 1500000,
    "status": "pending",
    "bank_account_number": "************7890",
    "created_at": "2026-02-23T12:30:00Z",
    "completed_at": null
  }
]
```

## 4.7 Pay Booking from Wallet (Wallet Router)

Endpoint:

- `POST /wallet/bookings/{booking_id}/pay`

Behavior:

- Delegates to booking payment service.
- Allowed booking statuses: `pending` or `confirmed`.
- Debits wallet and sets booking `paid`.

Response (`WalletBookingPaymentResponse`):

```json
{
  "booking_id": 501,
  "subtotal_minor": 1100000,
  "app_fee_minor": 110000,
  "provider_payout_minor": 990000,
  "fee_rate_bps": 1000,
  "message": "Booking paid from wallet"
}
```

## 5) Payments Router (Finance-Relevant)

## 5.1 Pay Booking from Wallet (Payments Router)

Endpoint:

- `POST /payments/bookings/{booking_id}/pay`

Behavior and response are same as `/wallet/bookings/{booking_id}/pay`.

## 5.2 Legacy Payment Callback for Booking

Endpoint:

- `GET /payments/callback?Authority=...&Status=OK`

Notes:

- Legacy gateway verification path for booking payments.
- Returns `{ success, message, booking_id?, ref_id? }` style payload.
- Wallet-first flow usually does not need this endpoint in modern UI.

## 6) Finance Config Values That Drive UI Behavior

Config endpoint (admin): `GET /admin/finance/config`

Important fields frontend should use:

- `wallet_charge_zarinpal_enabled`
- `wallet_charge_bank_transfer_enabled`
- `single_charge_max_minor`
- `wallet_max_balance_minor`
- `withdrawal_min_amount_minor`
- `withdrawal_processing_days`
- `default_fee_rate_bps` and percent
- `cancellation_refund_bps_before_start`
- `cancellation_refund_bps_after_start`

Frontend impact examples:

- Hide/disable top-up method buttons based on enable flags.
- Validate max single charge on client side.
- Prevent top-up UI amounts that exceed wallet max when added to current balance.
- Validate withdrawal minimum on client side.
- Show informational text for provider payout timing based on `payout_trigger` and `payout_hold_days`.

## 7) Admin Finance APIs

These endpoints require admin auth and permissions.

## 7.1 Get Finance Config

Endpoint:

- `GET /admin/finance/config`

Permission:

- `settings:read`

Response (`FinanceConfigResponse`):

```json
{
  "default_fee_rate_bps": 1000,
  "default_fee_rate_percent": 10,
  "charity_fee_rate_bps": 0,
  "charity_fee_rate_percent": 0,
  "payout_trigger": "after_review_or_days",
  "payout_hold_days": 3,
  "wallet_charge_zarinpal_enabled": true,
  "wallet_charge_bank_transfer_enabled": true,
  "withdrawal_min_amount_minor": 500000,
  "withdrawal_requires_admin_approval": true,
  "withdrawal_processing_days": 2,
  "cancellation_refund_bps_before_start": 10000,
  "cancellation_refund_bps_after_start": 0,
  "wallet_max_balance_minor": 50000000,
  "single_charge_max_minor": 10000000,
  "updated_at": "2026-02-23T10:00:00Z",
  "change_note": "optional"
}
```

## 7.2 Update Finance Config

Endpoint:

- `PATCH /admin/finance/config`

Permission:

- `settings:update`

Request (`UpdateFinanceConfigRequest`) is partial and supports:

- `default_fee_rate_bps` (0..5000)
- `charity_fee_rate_bps` (0..5000)
- `payout_trigger` in `immediately|after_hold_days|after_review_or_days`
- `payout_hold_days` (0..30)
- `wallet_charge_zarinpal_enabled`
- `wallet_charge_bank_transfer_enabled`
- `withdrawal_min_amount_minor` (>0)
- `withdrawal_requires_admin_approval`
- `withdrawal_processing_days` (1..30)
- `cancellation_refund_bps_before_start` (0..10000)
- `cancellation_refund_bps_after_start` (0..10000)
- `wallet_max_balance_minor` (>0)
- `single_charge_max_minor` (>0)
- `change_note` (optional)

Response:

```json
{
  "message": "Finance config updated"
}
```

## 7.3 List Service Fee Overrides

Endpoint:

- `GET /admin/finance/config/fee-rates`

Permission:

- `settings:read`

Response: array of `ServiceFeeRateResponse`.

## 7.4 Set Service Fee Override

Endpoint:

- `PUT /admin/finance/config/fee-rates/{service_type_id}?fee_rate_bps=1200`

Permission:

- `settings:update`

Rules:

- `fee_rate_bps` query param required, range 0..5000.

Response (`ServiceFeeRateUpdateResponse`):

```json
{
  "service_type_id": 3,
  "fee_rate_bps": 1200,
  "fee_rate_percent": 12
}
```

## 7.5 List Pending Bank Charges

Endpoint:

- `GET /admin/finance/charges/pending-bank`

Permission:

- `payment:read`

Query params:

- `skip` default `0`, min `0`
- `limit` default `50`, max `100`

Response: array of `PendingBankChargeResponse`.

## 7.6 Confirm Bank Charge

Endpoint:

- `POST /admin/finance/charges/{charge_id}/confirm?bank_reference=XYZ123`

Permission:

- `payment:adjust`

Behavior:

- Confirms pending bank transfer top-up.
- Creates payment (`kind=wallet_charge`, status `captured`, gateway `bank_transfer`).
- Credits wallet and marks charge succeeded.

Response (`ConfirmBankChargeResponse`):

```json
{
  "message": "Wallet charged",
  "new_balance_minor": 4200000
}
```

Edge responses:

- Already succeeded: `{"message":"Already confirmed","new_balance_minor":...}`
- `400` if charge is not pending
- `404` if charge not found

## 7.7 List Pending Withdrawals

Endpoint:

- `GET /admin/finance/withdrawals/pending`

Permission:

- `payment:read`

Response: array of `PendingWithdrawalResponse`.

## 7.8 Approve Withdrawal

Endpoint:

- `POST /admin/finance/withdrawals/{withdrawal_id}/approve?bank_transfer_reference=TRX-001`

Permission:

- `payment:payout`

Behavior:

- Marks withdrawal as `completed`.
- Stores transfer reference and review metadata.

Response:

```json
{
  "message": "Withdrawal marked as completed"
}
```

## 7.9 Reject Withdrawal

Endpoint:

- `POST /admin/finance/withdrawals/{withdrawal_id}/reject?admin_note=Invalid%20bank%20info`

Permission:

- `payment:adjust`

Rules:

- `admin_note` query param min length 5.

Behavior:

- Refunds amount back to wallet via `admin_adjustment` transaction.
- Marks withdrawal as `rejected`.

Response:

```json
{
  "message": "Withdrawal rejected and wallet refunded"
}
```

## 7.10 Transaction Explorer (Admin)

Endpoint:

- `GET /admin/finance/transactions`

Permission:

- `payment:read`

Query params:

- `source`: `all|payment|wallet_transaction|wallet_charge|withdrawal`
- `user_id` optional
- `booking_id` optional
- `from_datetime` optional
- `to_datetime` optional
- `skip` default `0`
- `limit` default `50`, max `200`

Response (`AdminTransactionsResponse`):

- `total`, `skip`, `limit`
- `items[]` unified rows with common fields plus type-specific detail objects:
- `payment`
- `wallet_transaction`
- `wallet_charge`
- `withdrawal`

## 7.11 Freeze Wallet

Endpoint:

- `POST /admin/finance/wallets/{user_id}/freeze?reason=...`

Permission:

- `payment:adjust`

Rules:

- `reason` query param required, min length 5.

Response:

```json
{
  "message": "Wallet frozen"
}
```

## 7.12 Unfreeze Wallet

Endpoint:

- `POST /admin/finance/wallets/{user_id}/unfreeze`

Permission:

- `payment:adjust`

Response:

```json
{
  "message": "Wallet unfrozen"
}
```

## 7.13 Manual Wallet Adjustment

Endpoint:

- `POST /admin/finance/wallets/{user_id}/adjust?amount_minor=...&reason_note=...`

Permission:

- `payment:adjust`

Rules:

- `amount_minor` query param (positive = credit, negative = debit, zero invalid)
- `reason_note` required, min length 5

Response (`AdjustmentResponse`):

```json
{
  "message": "Adjustment applied",
  "new_balance_minor": 5100000
}
```

Error:

- `400` on insufficient funds for negative adjustments

## 8) Frontend Action Matrix

### User wallet screens

- Wallet Home: call `GET /wallet/balance`; show frozen banner if `is_frozen=true`.
- Transaction History: call `GET /wallet/transactions`; add optional reason filter using enum values.
- Top-up: call `POST /wallet/charge/initiate`; for `zarinpal` redirect to `payment_url`; for `bank_transfer` show bank details and pending state.
- Withdrawal: call `POST /wallet/withdraw`, then refresh `GET /wallet/withdrawals` and `GET /wallet/balance`.

### Admin finance screens

- Config screen: `GET/PATCH /admin/finance/config`
- Fee overrides screen: `GET/PUT /admin/finance/config/fee-rates`
- Pending bank charges screen: `GET /admin/finance/charges/pending-bank`, then confirm with `/admin/finance/charges/{charge_id}/confirm`
- Pending withdrawals screen: list + approve/reject actions
- Transaction explorer screen: `GET /admin/finance/transactions` with filters
- Wallet moderation tools: freeze/unfreeze/adjust endpoints

## 9) Error Contract

Typical API error shape:

```json
{
  "detail": "Error message"
}
```

Common statuses:

- `400`: validation/business rule issue
- `403`: auth/permission/frozen wallet issue
- `404`: resource not found
- `422`: schema validation

## 10) Implementation Notes and Edge Cases

- Wallet is auto-created in balance/transactions/charge-initiate flows, but withdrawal uses wallet lock directly and may return `404` if wallet does not yet exist.
- In withdrawal list, `bank_account_number` is masked except last 4 digits.
- Bank-transfer charge is not auto-credited; admin confirmation is mandatory.
- Booking payment wallet flow exists under both `/payments/...` and `/wallet/...` endpoints with same result.
- Some notifications are sent server-side after finance events; frontend should not depend on notification success for flow success.
- `withdrawal_requires_admin_approval` exists in config response but is not currently enforced in wallet withdrawal endpoint logic (current flow always creates `pending` withdrawal).
- There is no dedicated user endpoint to list historical wallet charge attempts (`wallet_charges`) directly.

## 11) End-to-End Sequences

## 11.1 Zarinpal Wallet Top-up

1. User initiates charge with `method=zarinpal`.
2. Front redirects to `payment_url`.
3. Gateway redirects to `/wallet/charge/callback`.
4. Backend verifies and credits wallet.
5. Front shows callback result and refreshed balance.

## 11.2 Bank Transfer Wallet Top-up

1. User initiates charge with `method=bank_transfer`.
2. Front displays bank details and charge reference.
3. Admin confirms charge from pending-bank list.
4. Wallet balance updates; user sees credit in transactions.

## 11.3 Withdrawal

1. User submits `POST /wallet/withdraw`.
2. Amount is debited immediately; withdrawal status starts `pending`.
3. Admin approves -> `completed`, or rejects -> amount credited back.
4. User tracks status in `/wallet/withdrawals`.
