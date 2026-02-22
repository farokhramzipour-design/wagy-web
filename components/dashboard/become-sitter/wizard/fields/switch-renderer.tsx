import { useLanguage } from "@/components/providers/language-provider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { HelpTooltip } from "../help-tooltip";
import { FieldProps } from "../types";

export function SwitchRenderer({ field, value, onChange, error }: FieldProps) {
  const { lang } = useLanguage();
  const label = lang === "fa" ? field.label_fa : field.label_en;
  const helpText = lang === "fa" ? field.help_text_fa : field.help_text_en;

  return (
    <div className="py-2">
      <div className="flex items-center space-x-2 space-x-reverse">
        <Switch
          id={field.field_key}
          checked={!!value}
          onCheckedChange={(checked) => onChange(checked)}
          required={field.is_required}
          className={error ? "border-red-500" : ""}
        />
        <Label
          htmlFor={field.field_key}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
          {field.is_required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <HelpTooltip text={helpText} />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
