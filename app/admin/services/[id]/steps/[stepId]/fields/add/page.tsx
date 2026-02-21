"use client";

import { createServiceStepFieldAction } from "@/app/admin/services/actions";
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
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { CreateServiceStepFieldRequest } from "@/services/admin-api";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const content = { en, fa };

const FIELD_TYPES = [
  "text", "textarea", "number", "currency", "email", "phone", "url",
  "select", "multiselect", "radio", "checkbox", "switch",
  "date", "time", "datetime", "slider",
  "file", "image", "color", "json", "html"
];

export default function AddServiceStepFieldPage({ params }: { params: { id: string; stepId: string } }) {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = (content[lang] as any).admin.services.fieldsPage;
  const tCommon = (content[lang] as any).admin.services.form;
  const isRtl = lang === "fa";
  const serviceId = parseInt(params.id);
  const stepId = parseInt(params.stepId);

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
    options: null, // We'll handle options as JSON string in UI for now or dynamic list
    is_active: true,
  });

  const [optionsJson, setOptionsJson] = useState("");

  const handleCreate = async () => {
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
      }

      // Clean up empty strings to null for optional fields
      if (!payload.pattern) payload.pattern = null;
      if (!payload.placeholder_en) payload.placeholder_en = null;
      if (!payload.placeholder_fa) payload.placeholder_fa = null;
      if (!payload.help_text_en) payload.help_text_en = null;
      if (!payload.help_text_fa) payload.help_text_fa = null;
      if (!payload.default_value) payload.default_value = null;

      await createServiceStepFieldAction(stepId, payload);
      toast.success(t.form.success || "Field created successfully");
      router.push(`/admin/services/${serviceId}/steps/${stepId}/fields`);
    } catch (error) {
      console.error("Failed to create field:", error);
      toast.error(t.form.error || "Failed to create field");
    } finally {
      setSubmitting(false);
    }
  };

  // Factory for type-specific fields
  const renderTypeSpecificFields = () => {
    switch (formData.field_type) {
      case "number":
      case "currency":
      case "slider":
        return (
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
                placeholder={t.form.patternPlaceholder}
              />
            </div>
          </div>
        );
      case "select":
      case "multiselect":
      case "radio":
        return (
          <div className="grid gap-2">
            <div className="p-4 bg-muted rounded-md text-sm text-muted-foreground">
              {t.optionsConfig}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push(`/admin/services/${serviceId}/steps/${stepId}/fields`)}>
            <ArrowLeft className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t.createTitle}</h1>
            <p className="text-muted-foreground">{t.createDesc}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            {t.form.cancel}
          </Button>
          <Button onClick={handleCreate} disabled={submitting}>
            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className={`h-4 w-4 ${isRtl ? "ml-2" : "mr-2"}`} />}
            {t.form.save}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t.basicInformation}</CardTitle>
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
              <p className="text-xs text-muted-foreground">{t.keyDescription}</p>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.labelsPlaceholders}</CardTitle>
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
            <CardTitle>{t.typeConfiguration}</CardTitle>
            <CardDescription>{t.typeConfigurationDescription} <strong>{formData.field_type}</strong></CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!["select", "multiselect", "radio"].includes(formData.field_type) && (
              <div className="grid gap-2">
                <Label htmlFor="default_value">{t.defaultValue}</Label>
                <Input
                  id="default_value"
                  value={formData.default_value ?? ""}
                  onChange={(e) => setFormData({ ...formData, default_value: e.target.value })}
                />
              </div>
            )}

            {renderTypeSpecificFields()}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t.advancedConfiguration}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="depends_on_field">{t.form.dependsOnField}</Label>
                <Input
                  id="depends_on_field"
                  value={formData.depends_on_field ?? ""}
                  onChange={(e) => setFormData({ ...formData, depends_on_field: e.target.value })}
                  placeholder={t.form.dependsOnFieldPlaceholder}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="depends_on_value">{t.form.dependsOnValue}</Label>
                <Input
                  id="depends_on_value"
                  value={formData.depends_on_value ?? ""}
                  onChange={(e) => setFormData({ ...formData, depends_on_value: e.target.value })}
                  placeholder={t.form.dependsOnValuePlaceholder}
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
                        placeholder={t.form.filterTypePlaceholder}
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
