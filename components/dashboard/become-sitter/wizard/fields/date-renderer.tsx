import { useLanguage } from "@/components/providers/language-provider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WizardField } from "../types";

interface FieldProps {
  field: WizardField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export function DateRenderer({ field, value, onChange, error }: FieldProps) {
  const { lang } = useLanguage();
  const label = lang === "fa" ? field.label_fa : field.label_en;
  const helpText = lang === "fa" ? field.help_text_fa : field.help_text_en;

  return (
    <div className="space-y-2">
      <Label htmlFor={field.field_key}>
        {label}
        {field.is_required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={field.field_key}
        type="date"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        required={field.is_required}
        className={error ? "border-red-500" : ""}
      />
      {helpText && <p className="text-xs text-muted-foreground">{helpText}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
