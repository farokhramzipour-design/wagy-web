"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  backStep,
  calculatePricing,
  completeWizard,
  getStepDetails,
  getWizard,
  nextStep,
  saveStepData,
} from "@/services/provider-api";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldFactory } from "./field-factory";
import { WizardResponse, WizardStep } from "./types";

interface ServiceWizardProps {
  providerServiceId: number;
  onComplete?: () => void;
}

export function ServiceWizard({ providerServiceId, onComplete }: ServiceWizardProps) {
  const router = useRouter();
  const { lang } = useLanguage();
  const isRtl = lang === "fa";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [wizard, setWizard] = useState<WizardResponse | null>(null);
  const [currentStep, setCurrentStep] = useState<WizardStep | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [debouncedFormData, setDebouncedFormData] = useState(formData);

  // Debounce formData
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFormData(formData);
    }, 500);
    return () => clearTimeout(handler);
  }, [formData]);

  // Handle Pricing Calculation
  useEffect(() => {
    let isCancelled = false;

    const runCalculation = async () => {
      if (!currentStep || !wizard) return;

      // The preview endpoint is read-only and computes derived fields.
      // We trigger calculation if there are ANY fields in the wizard that might need recalculation.
      // Specifically, if a field has a reference_field_key, it depends on another field.
      // Or if a field is referenced by another (which we don't know easily), it should trigger.
      // Simplest robust approach: if any numeric field exists in the step, try to calculate.
      // Or stick to: if any field has pricing metadata.
      const hasPricingFields = currentStep.fields.some(f =>
        f.pricing_role || f.pricing_component || f.reference_field_key || f.reference_percentage
      );

      if (!hasPricingFields) return;

      try {
        setIsCalculating(true);
        // We need service_type_id. provider_service has it.
        const serviceTypeId = wizard.provider_service.service_type_id;

        // Pass current form data. The API expects "values".
        // Note: The preview endpoint uses these values to override saved data.
        const result = await calculatePricing(serviceTypeId, debouncedFormData);

        if (isCancelled) return;

        // Handle unresolved fields (e.g. show warning)
        if (result.unresolved_fields && result.unresolved_fields.length > 0) {
          console.warn("Unresolved pricing fields:", result.unresolved_fields);
          // We could show a toast here, but it might be spammy while typing.
          // Ideally, we'd mark these fields in the UI.
        }

        // Update form data with calculated fields if they differ
        setFormData(prev => {
          const next = { ...prev };
          let changed = false;

          if (result.calculated_fields) {
            Object.entries(result.calculated_fields).forEach(([key, value]) => {
              // Only update if field exists in current step
              const fieldInStep = currentStep.fields.find(f => f.field_key === key);
              if (fieldInStep) {
                // Check if value is different (handling number/string conversion if needed)
                if (next[key] !== value) {
                  next[key] = value;
                  changed = true;
                }
              }
            });
          }

          return changed ? next : prev;
        });
      } catch (e) {
        if (!isCancelled) {
          console.error("Pricing calculation failed", e);
        }
      } finally {
        if (!isCancelled) {
          setIsCalculating(false);
        }
      }
    };

    // Only run if debouncedFormData has keys (not empty initial state)
    if (Object.keys(debouncedFormData).length > 0) {
      runCalculation();
    }

    return () => {
      isCancelled = true;
    };
  }, [debouncedFormData, currentStep, wizard]);

  // Load wizard definition
  useEffect(() => {
    loadWizard();
  }, [providerServiceId]);

  const loadWizard = async () => {
    try {
      setLoading(true);
      const data = await getWizard(providerServiceId);

      // Normalize data: ensure steps are available at top level
      if (!data.steps && data.service_type?.steps) {
        // @ts-ignore
        data.steps = data.service_type.steps;
      }

      setWizard(data);

      // Determine which step to load
      // If we have a current_step from provider_service, use that
      // But we need to find the step_id for it
      const steps = data.steps || [];
      if (steps.length === 0) {
        throw new Error("No steps found for this wizard configuration");
      }

      const currentStepNum = data.provider_service?.current_step || 1;
      const stepToLoad = steps.find(s => s.step_number === currentStepNum) || steps[0];

      if (stepToLoad) {
        await loadStep(stepToLoad.step_id);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load wizard");
    } finally {
      setLoading(false);
    }
  };

  const loadStep = async (stepId: number) => {
    try {
      setLoading(true);
      const details = await getStepDetails(providerServiceId, stepId);
      setCurrentStep(details.step);

      const initialData = details.saved_data || {};

      // Initialize default values for fields that have no data
      details.step.fields.forEach(field => {
        if (initialData[field.field_key] === undefined && field.default_value !== undefined && field.default_value !== null) {
          initialData[field.field_key] = field.default_value;
        }
      });

      setFormData(initialData);
      setValidationErrors({});
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load step details");
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear error for this field if it exists
    if (validationErrors[key]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const getVisibleFields = () => {
    if (!currentStep) return [];
    return currentStep.fields.filter((field) => {
      if (!field.is_active) return false;
      if (!field.depends_on_field) return true;

      const dependentValue = formData[field.depends_on_field];
      return String(dependentValue) === String(field.depends_on_value);
    });
  };

  const validateStep = () => {
    const errors: Record<string, string> = {};
    let isValid = true;
    const visibleFields = getVisibleFields();

    visibleFields.forEach((field) => {
      if (field.is_required) {
        const value = formData[field.field_key];
        const isEmpty = value === undefined || value === null || value === "";
        const isEmptyArray = Array.isArray(value) && value.length === 0;
        const isUnchecked = field.field_type === 'checkbox' && value !== true;

        if (isEmpty || isEmptyArray || isUnchecked) {
          errors[field.field_key] = isRtl ? "این فیلد اجباری است" : "This field is required";
          isValid = false;
        }
      }

      // Type validation
      if (['number', 'currency', 'slider'].includes(field.field_type)) {
        const value = formData[field.field_key];
        if (value !== undefined && value !== null && value !== "" && typeof value !== 'number') {
          errors[field.field_key] = isRtl ? "این فیلد باید عدد باشد" : "This field must be a number";
          isValid = false;
        }
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  const handleSave = async (goNext: boolean = false) => {
    if (!currentStep) return;

    if (goNext && !validateStep()) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // 1. Save current step data
      await saveStepData(providerServiceId, currentStep.step_id, formData);

      // 2. If goNext, call next API
      if (goNext) {
        // Check if this is the last step
        if (wizard && currentStep.step_number === wizard.provider_service.total_steps) {
          await completeWizard(providerServiceId);
          if (onComplete) {
            onComplete();
          } else {
            router.push("/app/become-sitter");
          }
          return;
        }

        const nextRes = await nextStep(providerServiceId);

        // Reload wizard to get updated state (current_step)
        // Ideally nextRes contains enough info, but let's reload wizard to be safe or use returned state
        const nextStepNum = nextRes.current_step;

        // Find next step id from our wizard definition (which might be stale if steps changed, but unlikely)
        const nextStepObj = wizard?.steps.find(s => s.step_number === nextStepNum);

        if (nextStepObj) {
          await loadStep(nextStepObj.step_id);
        } else {
          // Fallback: reload everything
          loadWizard();
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save data");
    } finally {
      setSaving(false);
    }
  };

  const handleBack = async () => {
    if (!currentStep) return;
    try {
      setLoading(true);
      const backRes = await backStep(providerServiceId);
      const prevStepNum = backRes.current_step;
      const prevStepObj = wizard?.steps.find(s => s.step_number === prevStepNum);
      if (prevStepObj) {
        await loadStep(prevStepObj.step_id);
      } else {
        loadWizard();
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to go back");
      setLoading(false);
    }
  };

  if (loading && !currentStep) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6 text-center text-red-600">
          <p>{error}</p>
          <Button onClick={loadWizard} variant="outline" className="mt-4">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!currentStep) return null;

  const isLastStep = wizard && currentStep.step_number === wizard.provider_service.total_steps;
  const visibleFields = getVisibleFields();

  return (
    <div className="space-y-6">
      {/* Service Info */}
      {wizard && (
        <div className="text-center space-y-2 mb-6">
          <h1 className="text-2xl font-bold">
            {isRtl ? wizard.service_type.name_fa : wizard.service_type.name_en}
          </h1>
          <p className="text-muted-foreground">
            {wizard.service_type.description}
          </p>
        </div>
      )}

      {/* Progress */}
      <div className="w-full bg-neutral-200 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep.step_number / (wizard?.provider_service.total_steps || 1)) * 100}%` }}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isRtl ? currentStep.title_fa : currentStep.title_en}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {visibleFields.map((field) => (
            <FieldFactory
              key={field.field_id}
              field={field}
              value={formData[field.field_key]}
              onChange={(val) => handleFieldChange(field.field_key, val)}
              error={validationErrors[field.field_key]}
            />
          ))}

          {visibleFields.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              No fields to display for this step.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep.step_number === 1 || loading || saving}
          >
            {isRtl ? <ArrowRight className="ml-2 h-4 w-4" /> : <ArrowLeft className="mr-2 h-4 w-4" />}
            {isRtl ? "مرحله قبل" : "Previous"}
          </Button>

          <Button onClick={() => handleSave(true)} disabled={loading || saving}>
            {loading || saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isLastStep ? (
              <>
                {isRtl ? "تکمیل و ارسال" : "Complete & Submit"}
                <CheckCircle2 className={isRtl ? "mr-2 h-4 w-4" : "ml-2 h-4 w-4"} />
              </>
            ) : (
              <>
                {isRtl ? "مرحله بعد" : "Next"}
                {isRtl ? <ArrowLeft className="mr-2 h-4 w-4" /> : <ArrowRight className="ml-2 h-4 w-4" />}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
