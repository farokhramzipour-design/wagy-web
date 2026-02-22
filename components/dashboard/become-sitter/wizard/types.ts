export type FieldType =
  | "text" | "textarea" | "number" | "currency" | "email" | "phone" | "url"
  | "select" | "multiselect" | "radio" | "checkbox" | "switch"
  | "date" | "time" | "datetime" | "slider" | "file" | "image"
  | "color" | "json" | "html";

export interface WizardOption {
  value: string;
  label_en: string;
  label_fa: string;
  is_active: boolean;
}

export interface WizardField {
  field_id: number;
  field_key: string;
  field_type: FieldType;
  label_en: string;
  label_fa: string;
  placeholder_en?: string | null;
  placeholder_fa?: string | null;
  help_text_en?: string | null;
  help_text_fa?: string | null;
  default_value?: any | null;
  is_required: boolean;
  is_active: boolean;
  min_value?: number | null;
  max_value?: number | null;
  min_length?: number | null;
  max_length?: number | null;
  pattern?: string | null;
  depends_on_field?: string | null;
  depends_on_value?: string | null;
  options?: WizardOption[];
}

export interface WizardStep {
  step_id: number;
  step_number: number;
  title_en: string;
  title_fa: string;
  description?: string;
  is_required: boolean;
  is_active: boolean;
  fields: WizardField[];
  saved_data?: Record<string, any>;
  is_complete: boolean;
}

export interface ServiceType {
  service_type_id: number;
  name_en: string;
  name_fa: string;
  description: string;
  icon_media_id: number;
  icon_url: string;
  icon_thumb_url: string;
  display_order: number;
  color: string;
  is_active: boolean;
  total_providers: number;
  steps: WizardStep[];
  created_at: string;
  updated_at: string;
}

export interface ProviderService {
  provider_service_id: number;
  provider_id: number;
  service_type_id: number;
  current_step: number;
  total_steps: number;
  completed_steps: number;
  status: string;
  is_complete: boolean;
  completed_at: string | null;
  is_active: boolean;
  activated_at: string | null;
  last_edited_step: number | null;
  created_at: string;
  updated_at: string;
}

export interface WizardResponse {
  service_type: ServiceType;
  provider_service: ProviderService;
  steps: WizardStep[];
}

export interface StepDetailsResponse {
  provider_service: ProviderService;
  step: WizardStep;
  saved_data: Record<string, any>;
  is_complete: boolean;
}

export interface FieldProps {
  field: WizardField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}
