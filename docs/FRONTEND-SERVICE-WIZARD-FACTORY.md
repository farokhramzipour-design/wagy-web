# Frontend Guide: Service Wizard With Factory Pattern

## Goal
Build one reusable frontend wizard that can render any service type from backend-configured data:
- `service_type`
- `steps`
- `fields`
- `options`

No hardcoded form per service type.

## API flow (provider side)
1. Select services:
- `PUT /api/v1/provider/services/selected`

2. Start one wizard:
- `POST /api/v1/provider/services/start`

3. Load wizard:
- `GET /api/v1/provider/services/{provider_service_id}/wizard`

4. Save step data:
- `POST /api/v1/provider/services/{provider_service_id}/step/{step_id}`

5. Navigate:
- `POST /api/v1/provider/services/{provider_service_id}/next`
- `POST /api/v1/provider/services/{provider_service_id}/back`
- `POST /api/v1/provider/services/{provider_service_id}/goto/{step_id}`

6. Submit for admin review:
- `POST /api/v1/provider/services/{provider_service_id}/submit-review`

## Important response fields
From `provider_service`:
- `current_step` (step number)
- `current_step_id` (step id, use this for routing/UI targeting)
- `wizard_approval_status`
- `has_pending_wizard_changes`

From `steps[]`:
- `step_id`
- `step_number`
- `fields[]`
- `saved_data`
- `is_complete`

From `fields[]`:
- `field_key`
- `field_type`
- `is_required`
- `options[]` (for select/radio/multiselect/checkbox)
- `depends_on_field`, `depends_on_value`

## Factory Pattern (recommended)
Use a factory that maps backend `field_type` to:
1. UI component
2. parse/format logic
3. default value
4. field-level validation

### 1) Contracts
```ts
type FieldType =
  | "text" | "textarea" | "number" | "currency" | "email" | "phone" | "url"
  | "select" | "multiselect" | "radio" | "checkbox" | "switch"
  | "date" | "time" | "datetime" | "slider" | "file" | "image"
  | "color" | "json" | "html";

type WizardField = {
  field_id: number;
  field_key: string;
  field_type: FieldType;
  label_en: string;
  label_fa: string;
  is_required: boolean;
  is_active: boolean;
  min_value?: number | null;
  max_value?: number | null;
  min_length?: number | null;
  max_length?: number | null;
  pattern?: string | null;
  depends_on_field?: string | null;
  depends_on_value?: string | null;
  options?: Array<{ value: string; label_en: string; label_fa: string; is_active: boolean }>;
};
```

### 2) Field renderer factory
```ts
type FieldRenderer = {
  defaultValue: unknown;
  parse: (raw: unknown) => unknown;
  validate?: (value: unknown, field: WizardField) => string | null;
  Component: React.ComponentType<FieldComponentProps>;
};

const fieldFactory: Record<FieldType, FieldRenderer> = {
  text: textRenderer,
  textarea: textAreaRenderer,
  number: numberRenderer,
  currency: currencyRenderer,
  email: emailRenderer,
  phone: phoneRenderer,
  url: urlRenderer,
  select: selectRenderer,
  multiselect: multiSelectRenderer,
  radio: radioRenderer,
  checkbox: checkboxRenderer,
  switch: switchRenderer,
  date: dateRenderer,
  time: timeRenderer,
  datetime: dateTimeRenderer,
  slider: sliderRenderer,
  file: fileRenderer,
  image: imageRenderer,
  color: colorRenderer,
  json: jsonRenderer,
  html: htmlRenderer,
};

export function getFieldRenderer(type: FieldType): FieldRenderer {
  return fieldFactory[type] ?? textRenderer;
}
```

### 3) Dynamic rendering
```tsx
function renderStep(step: WizardStep, formState: Record<string, unknown>) {
  return step.fields
    .filter((f) => f.is_active)
    .filter((f) => {
      if (!f.depends_on_field) return true;
      return String(formState[f.depends_on_field]) === String(f.depends_on_value);
    })
    .map((field) => {
      const renderer = getFieldRenderer(field.field_type);
      return (
        <renderer.Component
          key={field.field_id}
          field={field}
          value={formState[field.field_key] ?? renderer.defaultValue}
        />
      );
    });
}
```

## Save strategy
- Keep local draft state per step.
- On save button:
  - `POST /provider/services/{id}/step/{step_id}` with only changed keys (or full step payload).
- Use server response `is_complete` to update step status.

## Navigation strategy
- Use backend as source of truth:
  - after `next/back/goto`, refresh `provider_service`.
- Prefer `current_step_id` over matching by number in frontend routing.

## Approval-aware UX
- If `wizard_approval_status === "pending"`:
  - show "Under admin review".
- If `"rejected"`:
  - show rejection reason (`wizard_rejection_reason`), allow editing and resubmission.
- If `"approved"` and provider edits data:
  - UI should show "pending changes not live yet" when `has_pending_wizard_changes=true`.

## Minimal implementation checklist
- One generic `WizardPage` component
- `FieldRendererFactory`
- `StepProgress` based on server `steps[].is_complete`
- Save API integration by `step_id`
- Navigation integration with `current_step_id`
- Review state banner (`not_submitted/pending/approved/rejected`)

