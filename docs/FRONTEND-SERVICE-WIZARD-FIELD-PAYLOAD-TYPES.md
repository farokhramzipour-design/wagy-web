# Frontend Guide: Service Wizard Field Payload Types

## Purpose
This guide defines what value type frontend must send for each wizard field type in:

- `POST /api/v1/provider/services/{provider_service_id}/step/{step_id}`

Payload format is always:

```json
{
  "field_key_1": "...",
  "field_key_2": 123
}
```

Key points:
- Keys must be valid `field_key` values of that step.
- Unknown keys are rejected.
- For option fields, send option `value`, not `label`.

## Field Type -> Value Type

| field_type | Send JSON type | Example | Notes |
|---|---|---|---|
| `text` | `string` | `"My title"` | |
| `textarea` | `string` | `"Long description..."` | |
| `html` | `string` | `"<p>hello</p>"` | |
| `color` | `string` | `"#22aa55"` | |
| `email` | `string` | `"name@example.com"` | Must be valid email format |
| `phone` | `string` | `"+989123456789"` | Must match phone regex (`+` optional, digits only) |
| `url` | `string` | `"https://example.com"` | Must include `http` or `https` |
| `date` | `string` | `"2026-02-22"` | ISO date string |
| `time` | `string` | `"14:30:00"` | ISO time string |
| `datetime` | `string` | `"2026-02-22T14:30:00"` | ISO datetime string |
| `file` | `string` | `"uploads/abc.pdf"` | Backend currently validates as string |
| `image` | `string` | `"uploads/image.jpg"` | Backend currently validates as string |
| `number` | `number` | `3` | Must be numeric (not string, not bool) |
| `currency` | `number` | `500000` | Numeric amount (e.g. `price_per_night`) |
| `slider` | `number` | `7` | Must be numeric |
| `switch` | `boolean` | `true` | |
| `select` | `string` | `"small"` | Must be one active option `value` |
| `radio` | `string` | `"yes"` | Must be one active option `value` |
| `multiselect` | `string[]` | `["small","medium"]` | Items must be active option `value`s |
| `checkbox` | `string[]` | `["cats","dogs"]` | Items must be active option `value`s |
| `json` | `object` or `array` | `{"a":1}` or `[1,2]` | |

## Option fields (very important)

When backend returns options like:

```json
{
  "field_key": "dog_size",
  "field_type": "select",
  "options": [
    { "value": "small", "label_en": "Small" },
    { "value": "medium", "label_en": "Medium" }
  ]
}
```

Frontend must send:

```json
{
  "dog_size": "small"
}
```

Not:
- `"Small"` (label)
- option id
- localized label text

## Example: `price_per_night`

If field is configured as:
- `field_key = "price_per_night"`
- `field_type = "currency"`

Send:

```json
{
  "price_per_night": 500000
}
```

Do not send:

```json
{
  "price_per_night": "500000"
}
```

## Validation rules FE should respect

Backend may enforce these constraints if set on field config:
- `is_required`
- `min_value`, `max_value` (numeric fields)
- `min_length`, `max_length` (string fields)
- `pattern` (regex)
- `depends_on_field`, `depends_on_value` (conditional fields)

Practical FE behavior:
- Hide/disable dependent fields when dependency condition is not met.
- Do not submit hidden inactive dependent values.
- Use `default_value` only when no saved value exists.
- Show `help_text_*` and `placeholder_*` by user locale.

## Step save examples

### Mixed payload example
```json
{
  "price_per_night": 500000,
  "has_yard": true,
  "dog_size": ["small", "medium"],
  "availability_notes": "Available weekends"
}
```

### Date/time payload example
```json
{
  "available_from": "2026-03-01",
  "start_time": "09:00:00",
  "last_updated_at": "2026-03-01T09:00:00"
}
```

## FE pre-submit checklist

1. Use exact `field_key` names from current step.
2. Match JSON type to `field_type` from this guide.
3. For option fields, send option `value`.
4. Respect min/max/length/pattern constraints.
5. Remove unknown keys before submit.

