import { useLanguage } from "@/components/providers/language-provider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { HelpTooltip } from "../help-tooltip";
import { WizardField } from "../types";

interface FieldProps {
  field: WizardField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export function RadioRenderer({ field, value, onChange, error }: FieldProps) {
  const { lang } = useLanguage();
  const label = lang === "fa" ? field.label_fa : field.label_en;
  const helpText = lang === "fa" ? field.help_text_fa : field.help_text_en;
  const options = field.options || [];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Label>
          {label}
          {field.is_required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <HelpTooltip text={helpText} />
      </div>
      <RadioGroup
        value={value || ""}
        onValueChange={onChange}
        className="flex flex-col space-y-1"
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value={String(option.value)} id={`${field.field_key}-${option.value}`} />
            <Label
              htmlFor={`${field.field_key}-${option.value}`}
              className="text-sm font-normal cursor-pointer"
            >
              {lang === "fa" ? option.label_fa : option.label_en}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
