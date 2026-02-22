import { useLanguage } from "@/components/providers/language-provider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { HelpTooltip } from "../help-tooltip";
import { FieldProps } from "../types";

export function MultiSelectRenderer({ field, value, onChange, error }: FieldProps) {
  const { lang } = useLanguage();
  const label = lang === "fa" ? field.label_fa : field.label_en;
  const helpText = lang === "fa" ? field.help_text_fa : field.help_text_en;
  const options = field.options || [];
  const selectedValues = (value as string[]) || [];

  const handleToggle = (optionValue: string) => {
    if (selectedValues.includes(optionValue)) {
      onChange(selectedValues.filter((v) => v !== optionValue));
    } else {
      onChange([...selectedValues, optionValue]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Label>
          {label}
          {field.is_required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <HelpTooltip text={helpText} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id={`${field.field_key}-${option.value}`}
              checked={selectedValues.includes(option.value)}
              onCheckedChange={() => handleToggle(option.value)}
            />
            <Label
              htmlFor={`${field.field_key}-${option.value}`}
              className="text-sm font-normal cursor-pointer"
            >
              {lang === "fa" ? option.label_fa : option.label_en}
            </Label>
          </div>
        ))}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
