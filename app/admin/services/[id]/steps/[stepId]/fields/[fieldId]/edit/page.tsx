"use client";

import { getServiceStepFieldAction, updateServiceStepFieldAction } from "@/app/admin/services/actions";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { CreateServiceStepFieldRequest } from "@/services/admin-api";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const content = { en, fa };

const FIELD_TYPES = [
  "text", "textarea", "number", "currency", "email", "phone", "url",
  "select", "multiselect", "radio", "checkbox", "switch",
  "date", "time", "datetime", "slider",
  "file", "image", "color", "json", "html"
];

const PRICING_ROLES = [
  "base_price", "hourly_rate", "nightly_rate",
  "additional_pet_rate", "additional_pet_hourly", "additional_pet_nightly",
  "base_price_holiday_multiplier", "hourly_rate_holiday_multiplier", "nightly_rate_holiday_multiplier"
];

const PRICING_COMPONENTS = [
  "base_rate", "additional_pet_rate", "additional_rate",
  "multiplier", "conditional_fee", "discount"
];

const PRICING_UNITS = [
  "flat", "per_night", "per_hour", "per_pet", "percentage"
];

const CONDITION_TYPES = [
  "always", "holiday", "weekend", "weekday", "peak_season", "custom_date"
];

export default function EditServiceStepFieldPage({ params }: { params: { id: string; stepId: string; fieldId: string } }) {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = (content[lang] as any).admin.services.fieldsPage;
  const tCommon = (content[lang] as any).admin.services.form;
  const isRtl = lang === "fa";
  const serviceId = parseInt(params.id);
  const stepId = parseInt(params.stepId);
  const fieldId = parseInt(params.fieldId);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateServiceStepFieldRequest>({
    field_key: "",
    label_en: "",
    label_fa: "",
    field_type: "text",
    is_required: false,
    display_order: 0,
    min_value: null,
    max_value: null,
    min_length: null,
    max_length: null,
    pattern: null,
    placeholder_en: null,
    placeholder_fa: null,
    help_text_en: null,
    help_text_fa: null,
    default_value: null,
    options: null,
    is_active: true,
    depends_on_field: null,
    depends_on_value: null,
    is_filterable: false,
    filter_type: null,
    is_searchable: false,
    filter_priority: 0,
    pricing_role: null,
    pricing_component: null,
    pricing_unit: null,
    unit: null,
    reference_field_key: null,
    reference_percentage: null,
    condition_type: null,
  });

  const [optionsJson, setOptionsJson] = useState("");

  useEffect(() => {
    const fetchField = async () => {
      setLoading(true);
      try {
        const field = await getServiceStepFieldAction(fieldId);
        if (field) {
          setFormData({
            field_key: field.field_key,
            label_en: field.label_en,
            label_fa: field.label_fa,
            field_type: field.field_type,
            is_required: field.is_required,
            display_order: field.display_order,
            min_value: field.min_value ?? null,
            max_value: field.max_value ?? null,
            min_length: field.min_length ?? null,
            max_length: field.max_length ?? null,
            pattern: field.pattern ?? null,
            placeholder_en: field.placeholder_en ?? null,
            placeholder_fa: field.placeholder_fa ?? null,
            help_text_en: field.help_text_en ?? null,
            help_text_fa: field.help_text_fa ?? null,
            default_value: field.default_value ?? null,
            options: field.options ?? null,
            is_active: field.is_active ?? true,
            depends_on_field: field.depends_on_field ?? null,
            depends_on_value: field.depends_on_value ?? null,
            is_filterable: field.is_filterable ?? false,
            filter_type: field.filter_type ?? null,
            is_searchable: field.is_searchable ?? false,
            filter_priority: field.filter_priority ?? 0,
            pricing_role: (field as any).pricing_role ?? null,
            pricing_component: (field as any).pricing_component ?? null,
            pricing_unit: (field as any).pricing_unit ?? null,
            unit: (field as any).unit ?? null,
            reference_field_key: (field as any).reference_field_key ?? null,
            reference_percentage: (field as any).reference_percentage ?? null,
            condition_type: (field as any).condition_type ?? null,
          });

          if (field.options) {
            setOptionsJson(JSON.stringify(field.options, null, 2));
          }
        }
      } catch (error) {
        console.error("Failed to fetch field:", error);
        toast.error("Failed to fetch field details");
        router.push(`/admin/services/${serviceId}/steps/${stepId}/fields`);
      } finally {
        setLoading(false);
      }
    };

    if (stepId && fieldId) {
      fetchField();
    }
  }, [stepId, fieldId, serviceId, router]);

  const handleUpdate = async () => {
    // Validate key
    if (!formData.field_key || !formData.label_en || !formData.label_fa) {
      toast.error(tCommon.required || "Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const payload = { ...formData };

      // Parse options if applicable
      if (["select", "multiselect", "radio"].includes(payload.field_type) && optionsJson) {
        try {
          payload.options = JSON.parse(optionsJson);
        } catch (e) {
          toast.error("Invalid JSON for options");
          setSubmitting(false);
          return;
        }
      } else {
        // If options are cleared or not applicable, ensure it's null or handled correctly
        // If field type changed away from select, maybe clear options?
        // Keeping existing logic: if json is empty but type expects options, it might be an issue, 
        // but if type doesn't expect options, we can ignore it.
        if (!["select", "multiselect", "radio"].includes(payload.field_type)) {
          payload.options = null;
        }
      }

      // Clean up empty strings to null for optional fields
      if (!payload.pattern) payload.pattern = null;
      if (!payload.placeholder_en) payload.placeholder_en = null;
      if (!payload.placeholder_fa) payload.placeholder_fa = null;
      if (!payload.help_text_en) payload.help_text_en = null;
      if (!payload.help_text_fa) payload.help_text_fa = null;
      if (!payload.default_value) payload.default_value = null;
      if (!payload.depends_on_field) payload.depends_on_field = null;
      if (!payload.depends_on_value) payload.depends_on_value = null;
      if (!payload.filter_type) payload.filter_type = null;
      if (!payload.pricing_role) payload.pricing_role = null;
      if (!payload.pricing_component) payload.pricing_component = null;
      if (!payload.pricing_unit) payload.pricing_unit = null;
      if (!payload.unit) payload.unit = null;
      if (!payload.reference_field_key) payload.reference_field_key = null;
      if (!payload.reference_percentage) payload.reference_percentage = null;
      if (!payload.condition_type) payload.condition_type = null;

      // Pricing Validation
      if (payload.pricing_component && !payload.pricing_unit) {
        toast.error("Pricing Unit is required when Pricing Component is set");
        setSubmitting(false);
        return;
      }
      if (payload.pricing_unit && !payload.pricing_component) {
        toast.error("Pricing Component is required when Pricing Unit is set");
        setSubmitting(false);
        return;
      }
      if (payload.reference_percentage && !payload.reference_field_key) {
        toast.error("Reference Field Key is required when Reference Percentage is set");
        setSubmitting(false);
        return;
      }
      if (payload.reference_field_key && !payload.reference_percentage) {
        toast.error("Reference Percentage is required when Reference Field Key is set");
        setSubmitting(false);
        return;
      }
      if (payload.condition_type && !payload.pricing_component) {
        toast.error("Pricing Component is required when Condition Type is set");
        setSubmitting(false);
        return;
      }
      if (payload.reference_field_key && payload.reference_field_key === payload.field_key) {
        toast.error("Reference Field Key cannot reference itself");
        setSubmitting(false);
        return;
      }

      await updateServiceStepFieldAction(stepId, fieldId, payload);
      toast.success(t.form.successUpdate || "Field updated successfully");
      router.push(`/admin/services/${serviceId}/steps/${stepId}/fields`);
    } catch (error) {
      console.error("Failed to update field:", error);
      toast.error(t.form.errorUpdate || "Failed to update field");
    } finally {
      setSubmitting(false);
    }
  };

  const renderPricingConfiguration = () => {
    if (!["number", "currency", "slider"].includes(formData.field_type)) {
      return null;
    }

    return (
      <Card className="md:col-span-2 border-orange-200 bg-orange-50/30">
        <CardHeader>
          <CardTitle className="text-orange-700">Pricing Configuration</CardTitle>
          <CardDescription>Configure how this field affects service pricing calculations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="pricing_role">Pricing Role</Label>
              <Select
                value={formData.pricing_role || "none"}
                onValueChange={(value) => setFormData({ ...formData, pricing_role: value === "none" ? null : value })}
              >
                <SelectTrigger id="pricing_role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {PRICING_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pricing_component">Pricing Component</Label>
              <Select
                value={formData.pricing_component || "none"}
                onValueChange={(value) => setFormData({ ...formData, pricing_component: value === "none" ? null : value })}
              >
                <SelectTrigger id="pricing_component">
                  <SelectValue placeholder="Select component" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {PRICING_COMPONENTS.map((comp) => (
                    <SelectItem key={comp} value={comp}>{comp}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pricing_unit">Pricing Unit</Label>
              <Select
                value={formData.pricing_unit || "none"}
                onValueChange={(value) => setFormData({ ...formData, pricing_unit: value === "none" ? null : value })}
              >
                <SelectTrigger id="pricing_unit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {PRICING_UNITS.map((unit) => (
                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="condition_type">Condition Type</Label>
              <Select
                value={formData.condition_type || "none"}
                onValueChange={(value) => setFormData({ ...formData, condition_type: value === "none" ? null : value })}
              >
                <SelectTrigger id="condition_type">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {CONDITION_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reference_field_key">Reference Field Key</Label>
              <Input
                id="reference_field_key"
                value={formData.reference_field_key || ""}
                onChange={(e) => setFormData({ ...formData, reference_field_key: e.target.value || null })}
                placeholder="Key of referenced field"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reference_percentage">Reference Percentage (Multiplier)</Label>
              <Input
                id="reference_percentage"
                type="number"
                step="0.01"
                min="0"
                max="99.99"
                value={formData.reference_percentage || ""}
                onChange={(e) => setFormData({ ...formData, reference_percentage: e.target.value ? parseFloat(e.target.value) : null })}
                placeholder="e.g., 1.5 for 150%"
              />
              <p className="text-xs text-muted-foreground">Multiplier value (0 - 99.99). Example: 1.5 means 150%.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Factory for type-specific fields
  const renderTypeSpecificFields = () => {
    switch (formData.field_type) {
      case "number":
      case "currency":
      case "slider":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="min_value">{t.form.minValue}</Label>
                <Input
                  id="min_value"
                  type="number"
                  value={formData.min_value ?? ""}
                  onChange={(e) => setFormData({ ...formData, min_value: e.target.value ? parseFloat(e.target.value) : null })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="max_value">{t.form.maxValue}</Label>
                <Input
                  id="max_value"
                  type="number"
                  value={formData.max_value ?? ""}
                  onChange={(e) => setFormData({ ...formData, max_value: e.target.value ? parseFloat(e.target.value) : null })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={formData.unit ?? ""}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="e.g. $, kg, m²"
              />
            </div>
          </div>
        );
      case "text":
      case "textarea":
      case "email":
      case "url":
      case "phone":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="min_length">{t.form.minLength}</Label>
                <Input
                  id="min_length"
                  type="number"
                  value={formData.min_length ?? ""}
                  onChange={(e) => setFormData({ ...formData, min_length: e.target.value ? parseInt(e.target.value) : null })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="max_length">{t.form.maxLength}</Label>
                <Input
                  id="max_length"
                  type="number"
                  value={formData.max_length ?? ""}
                  onChange={(e) => setFormData({ ...formData, max_length: e.target.value ? parseInt(e.target.value) : null })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pattern">{t.form.pattern}</Label>
              <Input
                id="pattern"
                value={formData.pattern ?? ""}
                onChange={(e) => setFormData({ ...formData, pattern: e.target.value })}
                placeholder="Regex pattern"
              />
            </div>
          </div>
        );
      case "select":
      case "multiselect":
      case "radio":
        return (
          <div className="grid gap-2">
            <Label htmlFor="options">Options (JSON)</Label>
            <Textarea
              id="options"
              value={optionsJson}
              onChange={(e) => setOptionsJson(e.target.value)}
              placeholder='[{"label": "Option 1", "value": "1"}, ...]'
              className="font-mono text-sm"
              rows={5}
            />
            <p className="text-xs text-muted-foreground">Provide options as a JSON array of objects with label and value.</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push(`/admin/services/${serviceId}/steps/${stepId}/fields`)}>
            <ArrowLeft className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t.editTitle}</h1>
            <p className="text-muted-foreground">{t.editDesc}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            {t.form.cancel}
          </Button>
          <Button onClick={handleUpdate} disabled={submitting}>
            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className={`h-4 w-4 ${isRtl ? "ml-2" : "mr-2"}`} />}
            {t.form.update}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="field_key" className="after:content-['*'] after:ml-0.5 after:text-red-500">{t.form.key}</Label>
              <Input
                id="field_key"
                value={formData.field_key}
                onChange={(e) => setFormData({ ...formData, field_key: e.target.value })}
                placeholder={t.form.keyPlaceholder}
              />
              <p className="text-xs text-muted-foreground">Unique identifier for this field (e.g. pet_name)</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="field_type" className="after:content-['*'] after:ml-0.5 after:text-red-500">{t.form.type}</Label>
              <Select
                value={formData.field_type}
                onValueChange={(value) => setFormData({ ...formData, field_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="display_order">{t.form.displayOrder}</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="flex items-center space-x-2 gap-2 pt-2">
              <Checkbox
                id="is_required"
                checked={formData.is_required}
                onCheckedChange={(checked) => setFormData({ ...formData, is_required: checked as boolean })}
              />
              <Label htmlFor="is_required">{t.form.isRequired}</Label>
            </div>

            <div className="flex items-center space-x-2 gap-2 pt-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked as boolean })}
              />
              <Label htmlFor="is_active">Is Active</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Labels & Placeholders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="label_en" className="after:content-['*'] after:ml-0.5 after:text-red-500">{t.form.labelEn}</Label>
              <Input
                id="label_en"
                value={formData.label_en}
                onChange={(e) => setFormData({ ...formData, label_en: e.target.value })}
                placeholder={t.form.labelEnPlaceholder}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="label_fa" className="after:content-['*'] after:ml-0.5 after:text-red-500">{t.form.labelFa}</Label>
              <Input
                id="label_fa"
                value={formData.label_fa}
                onChange={(e) => setFormData({ ...formData, label_fa: e.target.value })}
                placeholder={t.form.labelFaPlaceholder}
                dir="rtl"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="placeholder_en">{t.form.placeholderEn}</Label>
              <Input
                id="placeholder_en"
                value={formData.placeholder_en ?? ""}
                onChange={(e) => setFormData({ ...formData, placeholder_en: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="placeholder_fa">{t.form.placeholderFa}</Label>
              <Input
                id="placeholder_fa"
                value={formData.placeholder_fa ?? ""}
                onChange={(e) => setFormData({ ...formData, placeholder_fa: e.target.value })}
                dir="rtl"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="help_text_en">{t.form.helpTextEn}</Label>
              <Input
                id="help_text_en"
                value={formData.help_text_en ?? ""}
                onChange={(e) => setFormData({ ...formData, help_text_en: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="help_text_fa">{t.form.helpTextFa}</Label>
              <Input
                id="help_text_fa"
                value={formData.help_text_fa ?? ""}
                onChange={(e) => setFormData({ ...formData, help_text_fa: e.target.value })}
                dir="rtl"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Type Configuration</CardTitle>
            <CardDescription>Configuration specific to <strong>{formData.field_type}</strong></CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="default_value">{t.form.defaultValue}</Label>
              <Input
                id="default_value"
                value={formData.default_value ?? ""}
                onChange={(e) => setFormData({ ...formData, default_value: e.target.value })}
              />
            </div>

            {renderTypeSpecificFields()}
          </CardContent>
        </Card>

        {renderPricingConfiguration()}

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Advanced Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="depends_on_field">{t.form.dependsOnField}</Label>
                <Input
                  id="depends_on_field"
                  value={formData.depends_on_field ?? ""}
                  onChange={(e) => setFormData({ ...formData, depends_on_field: e.target.value })}
                  placeholder="Key of parent field"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="depends_on_value">{t.form.dependsOnValue}</Label>
                <Input
                  id="depends_on_value"
                  value={formData.depends_on_value ?? ""}
                  onChange={(e) => setFormData({ ...formData, depends_on_value: e.target.value })}
                  placeholder="Value to trigger this field"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 gap-2">
                  <Checkbox
                    id="is_filterable"
                    checked={formData.is_filterable}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_filterable: checked as boolean })}
                  />
                  <Label htmlFor="is_filterable">{t.form.isFilterable}</Label>
                </div>
                {formData.is_filterable && (
                  <>
                    <div className="grid gap-2 pl-6">
                      <Label htmlFor="filter_type">{t.form.filterType}</Label>
                      <Input
                        id="filter_type"
                        value={formData.filter_type ?? ""}
                        onChange={(e) => setFormData({ ...formData, filter_type: e.target.value })}
                        placeholder="exact, range, etc."
                      />
                    </div>
                    <div className="grid gap-2 pl-6">
                      <Label htmlFor="filter_priority">{t.form.filterPriority}</Label>
                      <Input
                        id="filter_priority"
                        type="number"
                        value={formData.filter_priority ?? 0}
                        onChange={(e) => setFormData({ ...formData, filter_priority: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2 gap-2">
                  <Checkbox
                    id="is_searchable"
                    checked={formData.is_searchable}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_searchable: checked as boolean })}
                  />
                  <Label htmlFor="is_searchable">{t.form.isSearchable}</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}