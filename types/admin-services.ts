
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
  steps: ServiceStep[];
  created_at: string;
  updated_at: string;
}

export interface ServiceStep {
  step_id: number;
  service_type_id: number;
  step_number: number;
  title_en: string;
  title_fa: string;
  description: string;
  is_required: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  fields?: ServiceStepField[];
}

export interface ServiceStepField {
  field_id: number;
  step_id: number;
  field_key: string;
  label_en: string;
  label_fa: string;
  field_type: string;
  is_required: boolean;
  min_value?: number;
  max_value?: number;
  min_length?: number;
  max_length?: number;
  pattern?: string;
  placeholder_en?: string;
  placeholder_fa?: string;
  help_text_en?: string;
  help_text_fa?: string;
  display_order: number;
  default_value?: string;
  options?: any;
  depends_on_field?: string;
  depends_on_value?: string;
  is_filterable?: boolean;
  filter_type?: string;
  is_searchable?: boolean;
  filter_priority?: number;
  created_at: string;
  updated_at: string;
}

export interface FieldOption {
  option_id: number;
  field_id: number;
  label_en: string;
  label_fa: string;
  value: string;
  display_order: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// Request Types

export interface ServiceTypeCreateRequest {
  name_en: string;
  name_fa: string;
  description: string;
  icon_media_id: number;
  display_order: number;
  color: string;
  is_active: boolean;
}

export interface ServiceTypeUpdateRequest {
  name_en?: string;
  name_fa?: string;
  description?: string;
  icon_media_id?: number;
  display_order?: number;
  color?: string;
  is_active?: boolean;
}

export interface ToggleStatusRequest {
  is_active: boolean;
}

export interface ServiceStepCreateRequest {
  step_number: number;
  title_en: string;
  title_fa: string;
  description: string;
  is_required: boolean;
}

export interface ServiceStepUpdateRequest {
  step_number?: number;
  title_en?: string;
  title_fa?: string;
  description?: string;
  is_required?: boolean;
}

export interface ReorderStepsRequest {
  ordered_step_ids: number[];
}

export interface ServiceFieldCreateRequest {
  field_key: string;
  label_en: string;
  label_fa: string;
  field_type: string;
  is_required: boolean;
  min_value?: number | null;
  max_value?: number | null;
  min_length?: number | null;
  max_length?: number | null;
  pattern?: string | null;
  placeholder_en?: string | null;
  placeholder_fa?: string | null;
  help_text_en?: string | null;
  help_text_fa?: string | null;
  display_order: number;
  default_value?: string | null;
  options?: any;
  depends_on_field?: string | null;
  depends_on_value?: string | null;
  is_filterable?: boolean;
  filter_type?: string | null;
  is_searchable?: boolean;
  filter_priority?: number;
  is_active?: boolean;
}

export interface ServiceFieldUpdateRequest {
  field_key?: string;
  label_en?: string;
  label_fa?: string;
  field_type?: string;
  is_required?: boolean;
  min_value?: number | null;
  max_value?: number | null;
  min_length?: number | null;
  max_length?: number | null;
  pattern?: string | null;
  placeholder_en?: string | null;
  placeholder_fa?: string | null;
  help_text_en?: string | null;
  help_text_fa?: string | null;
  display_order?: number;
  default_value?: string | null;
  options?: any;
  depends_on_field?: string | null;
  depends_on_value?: string | null;
  is_filterable?: boolean;
  filter_type?: string | null;
  is_searchable?: boolean;
  filter_priority?: number;
}

export interface ReorderFieldsRequest {
  ordered_field_ids: number[];
}

export interface FieldOptionCreateRequest {
  label_en: string;
  label_fa: string;
  value: string;
  display_order: number;
  is_default: boolean;
}

export interface FieldOptionUpdateRequest {
  label_en?: string;
  label_fa?: string;
  value?: string;
  display_order?: number;
  is_default?: boolean;
}
