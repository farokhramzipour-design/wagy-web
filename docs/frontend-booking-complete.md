# Frontend Integration Doc: Booking (Complete)

This document is intended to be enough for frontend to build the full booking experience end-to-end against current backend behavior.

Base path used below: `/api/v1`

## 1) Scope

This covers:

- Booking creation and detail/list pages
- Provider request inbox and actions (accept/decline/check-in/check-out)
- User/provider/admin cancellation paths
- Payment for booking (wallet-first flow)
- Booking status lifecycle and UI action gating
- Required validation and known edge cases

This does not cover:

- Service builder pricing metadata authoring (separate doc)
- Search/discovery screens

## 2) Actors and Permissions

### User (pet owner)

- Create booking
- View own bookings and booking details
- Pay booking
- Cancel own booking (when cancellable)

### Provider owner

- View provider bookings and pending requests
- Accept/confirm booking request
- Decline booking request
- Check-in booking
- Check-out booking
- Cancel own provider booking (when cancellable)

### Admin (active admin)

- Can access any booking details
- Can accept/decline/cancel/check-in/check-out bookings

## 3) Booking and Payment Status Enums

### Booking status (`BookingStatus`)

- `pending`
- `confirmed`
- `paid`
- `in_progress`
- `completed`
- `cancelled_user`
- `cancelled_provider`
- `cancelled_admin`
- `expired`

### Payment status (`PaymentStatus`)

- `pending`
- `processing`
- `completed`
- `captured`
- `paid_out`
- `failed`
- `refunded`
- `partial_refund`

### Cancellation reason (`CancellationReason`)

- `user_changed_plans`
- `user_emergency`
- `provider_unavailable`
- `provider_emergency`
- `pet_health_issue`
- `weather`
- `other`

## 4) Booking Lifecycle (State Machine)

Typical path:

1. User creates booking -> `pending` (expires in 24 hours)
2. Provider accepts -> `confirmed`
3. User pays -> `paid`
4. Provider check-in -> `in_progress`
5. Provider check-out -> `completed`

Cancellation paths:

- `pending|confirmed|paid` -> `cancelled_user` (if user cancels)
- `pending|confirmed|paid` -> `cancelled_provider` (if provider cancels)
- `pending|confirmed|paid` -> `cancelled_admin` (if admin cancels)

Expiration:

- `pending` can become `expired` if `expires_at < now`
- Expiration is synchronized when listing/getting bookings, and before accept/decline

## 5) Request/Response Contracts

## 5.1 Create Booking

Endpoint:

- `POST /bookings`

Auth and prerequisites:

- Requires authenticated user
- Requires booking verifications (`all_users` group)

Request body (`CreateBookingRequest`):

```json
{
  "provider_service_id": 123,
  "pet_ids": [10, 11],
  "booking_date": "2026-03-10",
  "start_time": "10:00:00",
  "end_time": "13:30:00",
  "duration_hours": null,
  "check_in_date": null,
  "check_out_date": null,
  "special_requests": "Please send photo updates"
}
```

Rules:

- `pet_ids`: 1..10, no duplicates, must belong to current user
- Service must exist, active, and provider service status must be `active`
- Overnight flow when either `check_in_date` or `check_out_date` is present
- Overnight requires both check-in and check-out
- Overnight requires `check_out_date > check_in_date`
- Overnight requires `booking_date == check_in_date`
- Hourly flow: if `duration_hours` is null and `start_time` + `end_time` are provided, backend rounds up to next full hour
- Hourly flow: if `start_time` exists, `end_time` is required

Availability and pricing:

- Availability is validated (day/time/capacity/advance-booking/blocked dates)
- Price is calculated server-side
- Booking is created as `pending` with `expires_at = now + 24h`
- A booking-linked chat conversation is auto-created

Success response (`BookingResponse`, 201):

```json
{
  "booking_id": 501,
  "user_id": 7,
  "provider": {
    "provider_id": 25,
    "business_name": "Happy Paws",
    "user_name": "+98912..."
  },
  "service": {
    "provider_service_id": 123,
    "service_type_name": "Boarding"
  },
  "pets": [
    {
      "pet_id": 10,
      "name": "Milo",
      "type": "dog",
      "breed_name": "Mixed"
    }
  ],
  "booking_date": "2026-03-10",
  "start_time": "10:00:00",
  "end_time": "13:30:00",
  "duration_hours": 4,
  "check_in_date": null,
  "check_out_date": null,
  "duration_nights": null,
  "base_price": 900000,
  "additional_pet_price": 100000,
  "service_fee": 100000,
  "total_price": 1100000,
  "currency": "IRR",
  "status": "pending",
  "special_requests": "Please send photo updates",
  "created_at": "2026-02-23T10:00:00Z",
  "confirmed_at": null,
  "paid_at": null,
  "expires_at": "2026-02-24T10:00:00Z",
  "payment_status": null
}
```

Common errors:

- `400`: invalid pets ownership, invalid date/time combinations, service inactive, availability failure, pricing missing
- `403`: verification gate failure
- `404`: service not found
- `422`: schema validation

`payment_status` in `BookingResponse` is based on the latest capture payment (if any). In wallet flow, this is typically `captured` after successful pay.

## 5.2 List My Bookings (User)

Endpoint:

- `GET /bookings`

Query params:

- `status_filter` optional (`BookingStatus`)
- `skip` default `0`
- `limit` default `50`, max `100`

Behavior:

- Sort: `booking_date desc`
- Pending items may be auto-marked as `expired` during list read

Response item (`BookingListResponse`):

```json
{
  "booking_id": 501,
  "provider_business_name": "Happy Paws",
  "service_type_name": "Boarding",
  "booking_date": "2026-03-10",
  "number_of_pets": 2,
  "total_price": 1100000,
  "status": "pending",
  "created_at": "2026-02-23T10:00:00Z"
}
```

## 5.3 List Provider Pending Requests

Endpoint:

- `GET /bookings/provider/requests`

Query params:

- `status_filter` default `pending`
- `skip` default `0`
- `limit` default `50`, max `100`

Behavior:

- Requires provider account
- Sort: `created_at desc`
- Pending items may be auto-marked `expired`

Response item (`ProviderBookingListResponse`):

```json
{
  "booking_id": 501,
  "user_id": 7,
  "owner_name": "Owner Name",
  "service_type_name": "Boarding",
  "booking_date": "2026-03-10",
  "number_of_pets": 2,
  "total_price": 1100000,
  "status": "pending",
  "expires_at": "2026-02-24T10:00:00Z",
  "created_at": "2026-02-23T10:00:00Z"
}
```

Error:

- `403`: `Provider access required`

## 5.4 List Provider Bookings (All)

Endpoint:

- `GET /bookings/provider`

Query params same as above; `status_filter` default is none.

## 5.5 Get Booking Details

Endpoint:

- `GET /bookings/{booking_id}`

Access:

- Allowed for booking owner user, booking provider owner, active admin

Response:

- `BookingResponse` (same shape as create booking response)

Errors:

- `404`: not found
- `403`: not authorized

## 5.6 Accept/Confirm Booking (Provider/Admin)

Endpoints (both do same logic):

- `PUT /bookings/{booking_id}/confirm`
- `PUT /bookings/{booking_id}/accept`

Request body (`ConfirmBookingRequest`):

```json
{
  "message": "See you tomorrow"
}
```

Behavior:

- Booking must be `pending` and not expired
- Status -> `confirmed`
- `confirmed_at` set
- `expires_at` cleared
- If `message` provided, appended to `special_requests` with prefix `[Provider note]`

Response:

- `BookingResponse`

Errors:

- `404`: booking not found
- `403`: not booking owner provider/admin
- `400`: expired or wrong status

## 5.7 Decline Booking (Provider/Admin)

Endpoint:

- `PUT /bookings/{booking_id}/decline`

Request body (`DeclineBookingRequest`):

```json
{
  "reason": "provider_unavailable",
  "message": "Cannot host on this date"
}
```

Allowed reasons for decline validator:

- `provider_unavailable`
- `provider_emergency`
- `other`

If a different enum value is sent for decline, request validation fails.

Behavior:

- Booking must be `pending` and not expired
- Status -> `cancelled_provider`
- Sets cancellation fields and clears expiry

Response:

```json
{
  "message": "Booking request declined successfully",
  "booking_id": 501,
  "status": "cancelled_provider"
}
```

## 5.8 Cancel Booking (User/Provider/Admin)

Endpoint:

- `PUT /bookings/{booking_id}/cancel`

Request body (`CancelBookingRequest`):

```json
{
  "reason": "user_changed_plans",
  "notes": "Unexpected travel"
}
```

Rules:

- Allowed only if current status in `pending|confirmed|paid`
- Result status when cancelled by user: `cancelled_user`
- Result status when cancelled by provider: `cancelled_provider`
- Result status when cancelled by admin: `cancelled_admin`

Response base:

```json
{
  "message": "Booking cancelled successfully",
  "booking_id": 501,
  "status": "cancelled_user"
}
```

Response with refund when applicable:

```json
{
  "message": "Booking cancelled successfully",
  "booking_id": 501,
  "status": "cancelled_user",
  "refund_amount": 880000,
  "refund_status": "refunded_to_wallet"
}
```

Refund logic:

- If booking has `BookingPricing` snapshot (wallet capture flow), refund goes to wallet.
- Wallet refund before service start date uses `cancellation_refund_bps_before_start`.
- Wallet refund on/after service start date uses `cancellation_refund_bps_after_start`.
- Wallet refund response uses `refund_status = refunded_to_wallet`.
- If no pricing snapshot but legacy completed payment exists:
- original status `pending|confirmed` -> 100%
- original status `paid` and service start in >24h -> 80%
- original status `paid` and service start in <=24h -> 50%
- Payment status becomes `refunded` or `partial_refund`

## 5.9 Check-In (Provider/Admin)

Endpoint:

- `POST /bookings/{booking_id}/check-in`

Request (`CheckInRequest`):

```json
{
  "actual_check_in_time": "09:30:00",
  "notes": "Arrived"
}
```

Behavior:

- Booking must be `paid`
- Cannot check in before service date (`check_in_date` or `booking_date`)
- Status -> `in_progress`
- `check_in_at` set from `actual_check_in_time` or current UTC time
- `notes` currently not persisted

Response:

```json
{
  "message": "Checked in successfully",
  "booking_id": 501,
  "check_in_at": "2026-03-10T09:30:00Z"
}
```

## 5.10 Check-Out (Provider/Admin)

Endpoint:

- `POST /bookings/{booking_id}/check-out`

Request (`CheckOutRequest`):

```json
{
  "actual_check_out_time": "18:30:00",
  "notes": "Completed"
}
```

Behavior:

- Booking must be `in_progress`
- Status -> `completed`
- Sets `check_out_at` and `completed_at`
- Attempts payout release to provider wallet via finance config rules
- Returns whether payout was released now
- `notes` currently not persisted

Response:

```json
{
  "message": "Service completed successfully",
  "booking_id": 501,
  "completed_at": "2026-03-10T18:30:00Z",
  "payout_released": true
}
```

## 6) Payment APIs for Booking

Current production flow is wallet-first.

### 6.1 Pay Booking (Wallet-first, Payments router)

Endpoint:

- `POST /payments/bookings/{booking_id}/pay`

No request body.

Behavior:

- Allowed statuses: `pending` or `confirmed`
- Verifies booking belongs to current user
- Debits user wallet by booking total
- Creates capture payment (`kind=capture`, `status=captured`, gateway `wallet`)
- Creates immutable `booking_pricing` snapshot
- Sets booking status -> `paid`

Success response:

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

Common errors:

- `404`: booking not found
- `403`: not your booking
- `400`: invalid booking status
- `400`: insufficient wallet balance

### 6.2 Pay Booking (Wallet router alias)

Endpoint:

- `POST /wallet/bookings/{booking_id}/pay`

Behavior and response are functionally equivalent to `/payments/bookings/{booking_id}/pay`.

### 6.3 Legacy Gateway Callback

Endpoint:

- `GET /payments/callback?Authority=...&Status=OK`

Notes:

- Exists for legacy gateway verification path
- Frontend generally does not call this directly in SPA flow unless explicitly implementing gateway redirect handling

## 7) Verification Dependency for Booking Creation

To check what verifications are required for booking:

- `GET /verifications/requirements/create_booking`

Current action description says booking requires phone or email verification under `all_users` policy.

Useful user status endpoint:

- `GET /verifications/my-status`

Frontend recommendation:

- Before opening checkout, fetch `my-status` and/or action requirements
- Show blocked state with clear CTA to verification screens

## 8) Availability Rules (User-facing Error Mapping)

Availability failures return `400` with detail text from backend. Common messages:

- `Service not found`
- `Service is not active`
- `Provider has not configured availability`
- `Provider not available on <Day>s`
- `Requested time slot not available`
- `Outside operating hours (<range>)`
- `Date YYYY-MM-DD is blocked by provider`
- `Provider at maximum capacity for this date`
- `Would exceed maximum pets limit (<n>)`
- `Must book at least <n> days in advance`
- `Cannot book more than <n> days in advance`

Frontend should display these messages directly.

## 9) UI Action Matrix by Status

### User actions

- `pending`: view details, cancel, pay
- `confirmed`: view details, cancel, pay
- `paid`: view details, cancel
- `in_progress`: view details only
- `completed`: view details only
- `cancelled_*`: view details only
- `expired`: view details only

### Provider actions

- `pending`: accept/confirm, decline
- `confirmed`: cancel (optional), wait for payment
- `paid`: check-in, cancel
- `in_progress`: check-out
- others: view details only

## 10) Error Contract Summary

Common error shape:

```json
{
  "detail": "Error message"
}
```

Status usage:

- `400`: business rule violation
- `403`: permission/access violation
- `404`: resource not found
- `422`: schema/validation

## 11) Frontend Implementation Checklist

1. Build create-booking form for both hourly and overnight modes.
2. Enforce client-side date/time constraints matching backend rules.
3. Use backend response as source of truth for pricing display.
4. Show `expires_at` countdown for `pending` bookings.
5. Implement user booking list and provider request list with pagination/filter.
6. Implement detail page with role-aware action buttons.
7. Wire accept/decline/cancel/check-in/check-out actions with optimistic UI disabled states.
8. Wire wallet payment API and refresh booking detail after success.
9. Handle all `400` details directly in UI alerts/toasts.
10. Add status badge mapping exactly to enum values.
11. Treat all datetimes as UTC from backend and localize in UI.

## 12) Known Gaps and Notes

- `notes` in check-in/check-out requests are accepted but currently not stored.
- Both `/confirm` and `/accept` are active aliases for same provider accept behavior.
- Pending expiry is synchronized on certain reads/actions, not by a dedicated public cron endpoint.
- Booking creation auto-creates a chat conversation linked to `booking_id`.

## 13) Minimal End-to-End Sequence

1. User creates booking (`POST /bookings`) -> status `pending`
2. Provider opens `/bookings/provider/requests` and accepts (`PUT /bookings/{id}/accept`) -> status `confirmed`
3. User pays (`POST /payments/bookings/{id}/pay`) -> status `paid`
4. Provider check-in (`POST /bookings/{id}/check-in`) -> status `in_progress`
5. Provider check-out (`POST /bookings/{id}/check-out`) -> status `completed`
