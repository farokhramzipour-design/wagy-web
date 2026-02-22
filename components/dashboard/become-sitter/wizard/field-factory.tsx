import { CheckboxRenderer } from "./fields/checkbox-renderer";
import { DateRenderer } from "./fields/date-renderer";
import { MultiSelectRenderer } from "./fields/multiselect-renderer";
import { NumberRenderer } from "./fields/number-renderer";
import { RadioRenderer } from "./fields/radio-renderer";
import { SelectRenderer } from "./fields/select-renderer";
import { SwitchRenderer } from "./fields/switch-renderer";
import { TextRenderer } from "./fields/text-renderer";
import { TextareaRenderer } from "./fields/textarea-renderer";
import { TimeRenderer } from "./fields/time-renderer";
import { WizardField } from "./types";

interface FieldRendererProps {
  field: WizardField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

const renderers: Record<string, React.ComponentType<any>> = {
  text: TextRenderer,
  email: TextRenderer,
  phone: TextRenderer,
  url: TextRenderer,
  number: NumberRenderer,
  currency: NumberRenderer, // Reuse number for now
  slider: NumberRenderer, // Reuse number for now
  select: SelectRenderer,
  multiselect: MultiSelectRenderer,
  radio: RadioRenderer,
  checkbox: CheckboxRenderer,
  switch: SwitchRenderer,
  textarea: TextareaRenderer,
  date: DateRenderer,
  time: TimeRenderer,
  datetime: DateRenderer, // Reuse date for now
};

export function FieldFactory({ field, value, onChange, error }: FieldRendererProps) {
  const Renderer = renderers[field.field_type] || TextRenderer;
  return <Renderer field={field} value={value} onChange={onChange} error={error} />;
}
