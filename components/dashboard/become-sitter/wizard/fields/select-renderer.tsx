import { useLanguage } from "@/components/providers/language-provider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WizardField } from "../types";

interface FieldProps {
  field: WizardField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export function SelectRenderer({ field, value, onChange, error }: FieldProps) {
  const { lang } = useLanguage();
  const label = lang === "fa" ? field.label_fa : field.label_en;
  const placeholder = (lang === "fa" ? field.placeholder_fa : field.placeholder_en) || (lang === "fa" ? "انتخاب کنید" : "Select...");
  const helpText = lang === "fa" ? field.help_text_fa : field.help_text_en;

  return (
    <div className="space-y-2">
      <Label htmlFor={field.field_key}>
        {label}
        {field.is_required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Select
        value={value ? String(value) : undefined}
        onValueChange={(val) => onChange(val)}
        required={field.is_required}
      >
        <SelectTrigger className={error ? "border-red-500" : ""}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {field.options?.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {lang === "fa" ? option.label_fa : option.label_en}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {helpText && <p className="text-xs text-muted-foreground">{helpText}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
