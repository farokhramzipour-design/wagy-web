# Frontend Integration Doc: Service Builder Pricing Metadata

This doc includes only what frontend needs.

## 1) New Field Properties

These properties are available on service form fields (all optional / nullable):

- `pricing_role`
- `pricing_component`
- `pricing_unit`
- `reference_field_key`
- `reference_percentage`
- `condition_type`

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

## 3) Endpoints Changed For Frontend

### Admin field create/update (accept pricing metadata)

- `POST /api/v1/admin/service-types/steps/{step_id}/fields`
- `PUT /api/v1/admin/service-types/steps/{step_id}/fields/{field_id}`

### Field payload readers (return pricing metadata)

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

### New provider helper endpoint (implemented)

- `POST /api/v1/provider/services/{service_type_id}/calculate-pricing`

## 4) `calculate-pricing` API Contract

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

### Behavior

1. `values` can be partial. Backend merges it with provider editable wizard data.
2. Request values override saved editable values for this preview call.
3. Endpoint is read-only (no wizard data mutation).
4. Response can be partial. Unresolved refs/cycles are returned in `unresolved_fields` (no hard failure).

### Expected Errors

- `404`: service type not found
- `400`: service type inactive
- `400`: no selected service types yet
- `403`: service type not selected or pre-approval top-service restriction
- `422`: request validation error

## 5) UI Validation Rules

1. Pricing metadata only for numeric field types: `number`, `currency`, `slider`.
2. If `pricing_component` is set, `pricing_unit` is required.
3. If `pricing_unit` is set, `pricing_component` is required.
4. `reference_percentage` requires `reference_field_key`.
5. `reference_field_key` requires `reference_percentage`.
6. `condition_type` requires `pricing_component`.
7. `reference_field_key` cannot reference itself.
8. `reference_field_key` must match an existing field key in the same service type and target a numeric field.

## 6) Still Not Implemented

1. Full date-range runtime behavior for `peak_season` and `custom_date`.
2. Uniqueness enforcement for duplicate pricing roles/components per service type.
