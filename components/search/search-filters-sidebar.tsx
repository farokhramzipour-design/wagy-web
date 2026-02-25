"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { SearchAvailableFiltersResponse, SearchFilterMetadata, SearchFilterOption } from "@/services/search-api";

const content = { en, fa };

interface Props {
    metadata: SearchAvailableFiltersResponse | null;
    filters: Record<string, any>;
    setFilters: (filters: Record<string, any>) => void;
    onApply: () => void;
}

export function SearchFiltersSidebar({ metadata, filters, setFilters, onApply }: Props) {
    const { lang } = useLanguage();
    const t = content[lang];
    const tSearch = content[lang].search_sitter;

    const handleFilterChange = (key: string, value: any) => {
        // If value is empty string or null, remove key
        if (value === "" || value === null || value === undefined) {
            const newFilters = { ...filters };
            delete newFilters[key];
            setFilters(newFilters);
        } else {
            setFilters({ ...filters, [key]: value });
        }
    };

    if (!metadata) return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500">{tSearch.filters}</p>
        </div>
    );

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="font-bold text-lg">{tSearch.filters}</h2>
                <Button variant="ghost" size="sm" onClick={() => setFilters({})}>{tSearch.clear_filters}</Button>
            </div>

            {/* Dynamic Filters */}
            {metadata.filters.map((field) => (
                <div key={field.field_id} className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                        {lang === "fa" ? field.label_fa : field.label_en}
                    </Label>

                    <FilterInput
                        field={field}
                        value={filters[field.field_key]}
                        onChange={(val) => handleFilterChange(field.field_key, val)}
                        lang={lang}
                    />
                </div>
            ))}

            <Button className="w-full" onClick={onApply}>{tSearch.apply_filters}</Button>
        </div>
    );
}

function FilterInput({ field, value, onChange, lang }: { field: SearchFilterMetadata, value: any, onChange: (val: any) => void, lang: "en" | "fa" }) {

    if (field.field_type === "switch") {
        return (
            <div className="flex items-center space-x-2">
                <Switch checked={!!value} onCheckedChange={onChange} />
                <span className="text-sm text-gray-600">{value ? (lang === "fa" ? "بله" : "Yes") : (lang === "fa" ? "خیر" : "No")}</span>
            </div>
        );
    }

    if (field.field_type === "number" || field.field_type === "currency") {
        // Handle range
        if (field.filter_type === "range" || field.filter_type === "gte" || field.filter_type === "lte") {
            const currentVal = (typeof value === 'object' && value !== null) ? value : {};

            return (
                <div className="flex gap-2">
                    <Input
                        type="number"
                        placeholder="Min"
                        value={currentVal.gte || ""}
                        onChange={(e) => onChange({ ...currentVal, gte: Number(e.target.value) || undefined })}
                        className="h-8 text-sm"
                    />
                    <Input
                        type="number"
                        placeholder="Max"
                        value={currentVal.lte || ""}
                        onChange={(e) => onChange({ ...currentVal, lte: Number(e.target.value) || undefined })}
                        className="h-8 text-sm"
                    />
                </div>
            );
        }
        return <Input type="number" value={value || ""} onChange={(e) => onChange(Number(e.target.value))} className="h-9" />;
    }

    if (field.field_type === "select" || field.field_type === "radio") {
        return (
            <Select value={value?.toString()} onValueChange={onChange}>
                <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                    {Array.isArray(field.options) && (field.options as SearchFilterOption[]).map((opt) => (
                        <SelectItem key={opt.value} value={opt.value.toString()}>
                            {lang === "fa" ? opt.label_fa : opt.label_en}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        );
    }

    if (field.field_type === "multiselect") {
        const currentValues = Array.isArray(value) ? value : [];
        return (
            <div className="space-y-1.5">
                {Array.isArray(field.options) && (field.options as SearchFilterOption[]).map((opt) => {
                    const isChecked = currentValues.includes(opt.value);
                    return (
                        <div key={opt.value} className="flex items-center space-x-2">
                            <Checkbox
                                checked={isChecked}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        onChange([...currentValues, opt.value]);
                                    } else {
                                        onChange(currentValues.filter((v: any) => v !== opt.value));
                                    }
                                }}
                            />
                            <span className="text-sm font-medium text-gray-600">{lang === "fa" ? opt.label_fa : opt.label_en}</span>
                        </div>
                    )
                })}
            </div>
        );
    }

    return <Input value={value || ""} onChange={(e) => onChange(e.target.value)} className="h-9" />;
}
