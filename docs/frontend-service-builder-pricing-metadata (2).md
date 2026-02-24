# Frontend Integration Doc: Service Builder Pricing Metadata and Price Calculation

This document covers:

1. Pricing metadata fields and enums.
2. Provider-side `calculate-pricing` preview behavior.
3. Final booking-time price calculation (the amount actually charged).

## 1) Pricing Metadata Fields

These properties exist on service form fields (all optional / nullable):

- `pricing_role`
- `pricing_component`
- `pricing_unit`
- `reference_field_key`
- `reference_percentage`
- `condition_type`

Notes:

- Pricing metadata can only be set on numeric field types: `number`, `currency`, `slider`.
- `reference_percentage` is a multiplier, not a display percent. Example: `1.5` means 150%.
- `reference_percentage` is validated with range `0` to `99.99` in request schema.

## 2) Enum Values (Exact)

### `pricing_role`

- `base_price`
- `hourly_rate`
- `nightly_rate`
- `additional_pet_rate`
- `additional_pet_hourly`
- `additional_pet_nightly`
- `base_price_holiday_multiplier`
- `hourly_rate_holiday_multiplier`
- `nightly_rate_holiday_multiplier`

### `pricing_component`

- `base_rate`
- `additional_pet_rate`
- `additional_rate`
- `multiplier`
- `conditional_fee`
- `discount`

### `pricing_unit`

- `flat`
- `per_night`
- `per_hour`
- `per_pet`
- `percentage`

### `condition_type`

- `always`
- `holiday`
- `weekend`
- `weekday`
- `peak_season`
- `custom_date`

## 3) API Surfaces Used by Frontend

### Admin field create/update (accept pricing metadata)

- `POST /api/v1/admin/service-types/steps/{step_id}/fields`
- `PUT /api/v1/admin/service-types/steps/{step_id}/fields/{field_id}`

### Field readers (return pricing metadata)

- `GET /api/v1/admin/service-types`
- `GET /api/v1/admin/service-types/{service_type_id}`
- `GET /api/v1/admin/service-types/{service_type_id}/preview`
- `GET /api/v1/admin/service-types/steps/{step_id}/fields`
- `GET /api/v1/admin/service-types/fields/{field_id}`
- `POST /api/v1/admin/service-types/steps/{step_id}/fields`
- `PUT /api/v1/admin/service-types/steps/{step_id}/fields/{field_id}`
- `GET /api/v1/provider/service-types/available`
- `GET /api/v1/provider/services/{provider_service_id}/wizard`
- `GET /api/v1/provider/services/{provider_service_id}/step/{step_id}`

### Provider preview helper

- `POST /api/v1/provider/services/{service_type_id}/calculate-pricing`

## 4) `calculate-pricing` (Provider Preview) Contract

### Request

```json
{
  "values": {
    "base_nightly_rate": 1000000
  }
}
```

### Response

```json
{
  "calculated_fields": {
    "base_nightly_rate": 1000000,
    "holiday_rate": 1500000,
    "cleaning_fee": 200000
  },
  "derived_fields": {
    "holiday_rate": 1500000,
    "cleaning_fee": 200000
  },
  "field_formulas": {
    "holiday_rate": "base_nightly_rate × 1.5",
    "cleaning_fee": "base_nightly_rate × 0.2"
  },
  "unresolved_fields": []
}
```

### How Preview Calculation Works

This endpoint computes only reference-based derived fields. It does not run full booking price logic.

1. Start with provider editable wizard data (pending data if exists, otherwise saved data).
2. Overlay request `values` (request wins for this call only).
3. Find active fields in active steps where both `reference_field_key` and `reference_percentage` are set.
4. Resolve iteratively: for each unresolved field, if referenced key exists in `calculated_fields` and both values are numeric, compute `derived_value = referenced_value * reference_percentage`, then write it to `calculated_fields[field_key]`, add it to `derived_fields`, and store formula text in `field_formulas`.
5. Stop when no more fields can be resolved.
6. Any cycle/self-reference/missing dependency remains in `unresolved_fields`.

Important:

- Read-only endpoint: no wizard data mutation.
- `pricing_component`, `pricing_unit`, `pricing_role`, and `condition_type` are not used by this preview endpoint.
- Output numbers are serialized as JSON numbers (`float`).

### Expected Errors

- `404`: service type not found
- `400`: service type inactive
- `400`: no selected service types yet
- `403`: service type not selected or pre-approval top-service restriction
- `422`: request validation error

## 5) Final Booking-Time Price Calculation (Actual Charged Amount)

This is executed in booking creation via `PriceCalculator.calculate(...)`.

### Inputs that Affect Price

- `provider_service_id`
- `booking_date`
- `number_of_pets`
- `duration_nights` (overnight bookings)
- `duration_hours` (hourly bookings)

Duration behavior from booking API:

- Overnight: `duration_nights = check_out_date - check_in_date` (days).
- Hourly: if not provided directly, computed from `start_time`/`end_time` and rounded up to next hour.

### Resolution Order (Strict)

1. Dynamic component pricing (`pricing_component` based).
2. Role-based fallback (`pricing_role` mapped to legacy keys).
3. Legacy raw keys in service data (`pricing` object or legacy flat keys).

If none resolve pricing data, booking creation fails with: `Service has no pricing configured`.

### Dynamic Component Pricing Algorithm

For active pricing fields in the service type:

1. Resolve value for each field:
- use saved value at `service_data[field_key]` if present.
- else if field unit is `percentage` and field has `reference_percentage`, use that multiplier value.
- else if field has `reference_field_key` and `reference_percentage`, use `service_data[reference_field_key] * reference_percentage`.
2. First pass applies non-`percentage` units:
- `flat`: apply once if condition matches.
- `per_night`: multiply by count of matching nights.
- `per_hour`: multiply by matching hours.
- `per_pet`: multiply by pet count (for `additional_pet_rate`, uses `max(number_of_pets - 1, 0)`).
3. Second pass applies `percentage` fields:
- resolve reference amount from already computed field total or referenced field/raw value.
- `amount = reference_amount * percentage`.
4. Component sign:
- `discount` becomes negative.
- all other components stay positive.
5. Totals:
- `additional_pet_price = total(additional_pet_rate component)`.
- `base_price = sum(all component totals) - additional_pet_price`.

### Conditions

- `always`: always true
- `holiday`: uses `holidays` table (`locale = "fa-IR"`, `is_active = true`)
- `weekend`: `weekday() in {4, 5}` (Friday/Saturday)
- `weekday`: not weekend
- `peak_season`: currently always false
- `custom_date`: currently always false

### Role-Based / Legacy Fallback Behavior

If dynamic pricing has no resolvable value:

- Role fields map into legacy keys: `base_price`, `price_per_hour`, `price_per_night`, `additional_pet_rate`, `additional_dog_rate_per_hour`, `additional_dog_rate_per_night`, and holiday multipliers.
- Legacy calculator then runs:
- hourly: `price_per_hour * hours` (holiday multiplier if booking date is holiday)
- nightly: sum nightly rate per night (holiday multiplier per holiday night)
- flat: `base_price` (holiday multiplier if booking date is holiday)
- additional pets nightly: `additional_dog_rate_per_night * additional_pets * nights`
- additional pets hourly: `additional_dog_rate_per_hour * additional_pets * hours`
- additional pets flat: `additional_pet_rate * additional_pets`

### Service Fee and Total

After `base_price` and `additional_pet_price`:

- `subtotal = base_price + additional_pet_price`
- fee rate source priority: service-specific active `service_fee_rates.fee_rate_bps`, else global `finance_config.default_fee_rate_bps`, else default `1000` bps (10%)
- `platform_fee_percentage = fee_rate_bps / 10000`
- `service_fee = round_half_up(subtotal * platform_fee_percentage, 2 decimals)`
- `total_price = subtotal + service_fee`
- currency returned: `IRR`

### Worked Example (Booking-Time)

Assume:

- `base_rate` field = `1,000,000` (`pricing_component=base_rate`, `pricing_unit=flat`)
- `additional_pet_rate` field = `200,000` (`pricing_component=additional_pet_rate`, `pricing_unit=per_pet`)
- `discount` field = `100,000` (`pricing_component=discount`, `pricing_unit=flat`)
- `number_of_pets = 3`
- fee rate = `1000` bps (10%)

Computation:

- additional pets = `3 - 1 = 2`
- additional pet amount = `200,000 * 2 = 400,000`
- discount signed = `-100,000`
- component sum = `1,000,000 + 400,000 - 100,000 = 1,300,000`
- `additional_pet_price = 400,000`
- `base_price = 1,300,000 - 400,000 = 900,000`
- `subtotal = 900,000 + 400,000 = 1,300,000`
- `service_fee = 1,300,000 * 0.10 = 130,000`
- `total_price = 1,430,000`

Returned shape:

```json
{
  "base_price": 0,
  "additional_pet_price": 0,
  "subtotal": 0,
  "service_fee": 0,
  "service_fee_percentage": 10,
  "total_price": 0,
  "currency": "IRR"
}
```

## 6) Validation Rules for Pricing Metadata

1. Pricing metadata only for numeric field types: `number`, `currency`, `slider`.
2. If `pricing_component` is set, `pricing_unit` is required.
3. If `pricing_unit` is set, `pricing_component` is required.
4. `reference_percentage` requires `reference_field_key`.
5. `reference_field_key` requires `reference_percentage`.
6. `condition_type` requires `pricing_component`.
7. `reference_field_key` cannot reference itself.
8. `reference_field_key` must exist in same service type and target a numeric field.

## 7) Frontend Guidance

1. Use `calculate-pricing` for live wizard-derived field previews only.
2. Do not treat preview output as final booking total.
3. Final payable amount is computed server-side at booking creation time.
4. Handle `unresolved_fields` gracefully in UI (show warning, keep manual input/edit flow).

## 8) Current Limitations

1. `peak_season` and `custom_date` conditions are defined but currently return false at runtime.
2. No enforced uniqueness for duplicate pricing roles/components in a service type.
