import { useLanguage } from "@/components/providers/language-provider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HelpTooltip } from "../help-tooltip";
import { FieldProps } from "../types";

export function NumberRenderer({ field, value, onChange, error }: FieldProps) {
  const { lang } = useLanguage();
  const label = lang === "fa" ? field.label_fa : field.label_en;
  const placeholder = (lang === "fa" ? field.placeholder_fa : field.placeholder_en) || label;
  const helpText = lang === "fa" ? field.help_text_fa : field.help_text_en;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      onChange(null);
      return;
    }
    const num = parseFloat(val);
    if (!isNaN(num)) {
      onChange(num);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={field.field_key}>
          {label}
          {field.is_required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <HelpTooltip text={helpText} />
      </div>
      <Input
        id={field.field_key}
        type="number"
        value={value ?? ""}
        onChange={handleChange}
        placeholder={placeholder}
        required={field.is_required}
        min={field.min_value ?? undefined}
        max={field.max_value ?? undefined}
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
