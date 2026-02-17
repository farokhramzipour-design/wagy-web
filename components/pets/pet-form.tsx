"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createPet, getBreeds, type Breed, type PetCreationPayload } from "@/services/pet-api";
import { Dog, Cat, Check } from "lucide-react";
import { toast } from "sonner";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";

const content = { en, fa };

interface PetFormProps {
  accessToken?: string;
}

export function PetForm({ accessToken }: PetFormProps) {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = content[lang].petForm;
  
  const [loading, setLoading] = useState(false);
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<PetCreationPayload>({
    name: "",
    type: "dog",
    size: "medium",
    breed_id: 0,
    breed_other: "",
    gender: "male",
    date_of_birth: "",
    age_years: 0,
    weight_kg: 0,
    color: "",
    distinctive_features: "",
    microchip_id: "",
    is_neutered: false,
    spay_neuter_date: "",
    potty_training_status: "fully_trained",
    is_crate_trained: false,
    knows_basic_commands: false,
    energy_level: "moderate",
    exercise_requirements: "",
    is_friendly_with_dogs: true,
    is_friendly_with_cats: true,
    is_friendly_with_kids: true,
    is_friendly_with_strangers: true,
    has_separation_anxiety: false,
    is_reactive_on_leash: false,
    behavioral_notes: "",
    special_needs: "",
    feeding_instructions: "",
    food_brand: "",
    feeding_times: "",
    treats_allowed: true,
    food_allergies: "",
    medications: "",
    medication_instructions: "",
    walk_frequency: "",
    favorite_activities: "",
    favorite_toys: "",
    potty_schedule: "",
    sleep_location: "",
    sleep_schedule: "",
    special_instructions: "",
    vet_clinic_name: "",
    vet_name: "",
    vet_phone: "",
    vet_address: "",
    medical_conditions: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    emergency_contact_relationship: "",
    emergency_contact_2_name: "",
    emergency_contact_2_phone: "",
    has_pet_insurance: false,
    insurance_provider: "",
    insurance_policy_number: "",
  });

  // Fetch breeds when type changes
  useEffect(() => {
    if (accessToken && (formData.type === "dog" || formData.type === "cat")) {
      getBreeds(accessToken, formData.type as "dog" | "cat")
        .then(setBreeds)
        .catch((err) => console.error("Failed to fetch breeds", err));
    }
  }, [accessToken, formData.type]);

  const handleChange = (field: keyof PetCreationPayload, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!accessToken) return;

    // Validation
    const newErrors: Record<string, boolean> = {};
    if (!formData.name.trim()) newErrors.name = true;
    if (!formData.breed_id) newErrors.breed_id = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.name) toast.error(t.validation.nameRequired);
      else if (newErrors.breed_id) toast.error(t.validation.breedRequired);
      return;
    }

    setLoading(true);
    setErrors({});
    
    // Derived fields
    const payload = { ...formData };
    
    // Clean up microchip_id placeholder
    if (payload.microchip_id === "PENDING_INPUT") {
        payload.microchip_id = "";
    }

    if (payload.insurance_provider && payload.insurance_provider !== "None") {
        payload.has_pet_insurance = true;
    } else {
        payload.has_pet_insurance = false;
        payload.insurance_provider = "";
    }

    try {
      await createPet(accessToken, payload);
      toast.success(t.validation.success);
      router.push("/app/pets");
      router.refresh();
    } catch (error) {
      console.error("Failed to create pet", error);
      toast.error(t.validation.error);
    } finally {
      setLoading(false);
    }
  };

  // Helper for choice buttons
  const ChoiceGroup = ({ 
    options, 
    value, 
    onChange, 
    customLabel,
    multi = false
  }: { 
    options: { label: string, value: any, isCustom?: boolean }[], 
    value: any, 
    onChange: (val: any) => void,
    customLabel?: string,
    multi?: boolean
  }) => {
    const isCustomSelected = !multi && !options.some(o => o.value === value && !o.isCustom);
    
    // For multi-select, value is a string (comma separated) or array? API says string for medications.
    // I'll assume string for simplicity in this helper, but multi-select needs array logic.
    // The API `medications` is a string. So multi-select buttons should join values.
    
    const handleSelect = (optValue: any, isCustom: boolean) => {
      if (multi) {
        // Toggle logic for string storage (comma separated)
        const current = value ? (value as string).split(',').filter(Boolean) : [];
        if (current.includes(optValue)) {
            onChange(current.filter(v => v !== optValue).join(','));
        } else {
            onChange([...current, optValue].join(','));
        }
      } else {
        if (isCustom) {
           onChange(""); // Clear value to show input, or keep it empty
        } else {
           onChange(optValue);
        }
      }
    };

    return (
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
           const isSelected = multi 
             ? (value as string)?.split(',').includes(opt.value)
             : value === opt.value || (opt.isCustom && isCustomSelected && value !== "");
             
           return (
            <button
              key={opt.label}
              type="button"
              onClick={() => handleSelect(opt.value, !!opt.isCustom)}
              className={cn(
                "px-4 py-2 rounded-full border text-sm font-medium transition-colors",
                isSelected
                  ? "bg-neutral-800 text-white border-neutral-800"
                  : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
              )}
            >
              {opt.label}
            </button>
          );
        })}
        
        {/* Custom Input Area for Single Select */}
        {!multi && options.some(o => o.isCustom) && (
            <div className={cn("w-full mt-2", isCustomSelected ? "block" : "hidden")}>
                <Textarea 
                    placeholder={customLabel || t.placeholders.specify}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full"
                />
            </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-neutral-800">{t.title}</h1>
        <p className="text-neutral-500">{t.subtitle}</p>
      </div>

      {/* Type Selection */}
      <section className="space-y-4">
        <Label>{t.fields.type}</Label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleChange("type", "dog")}
            className={cn(
              "flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all",
              formData.type === "dog" ? "border-[#0ea5a4] bg-[#0ea5a4]/5" : "border-neutral-200 hover:border-neutral-300"
            )}
          >
            <Dog className={cn("w-8 h-8 mb-2", formData.type === "dog" ? "text-[#0ea5a4]" : "text-neutral-400")} />
            <span className={cn("font-medium", formData.type === "dog" ? "text-[#0ea5a4]" : "text-neutral-600")}>{t.options.dog}</span>
          </button>
          <button
            type="button"
            onClick={() => handleChange("type", "cat")}
            className={cn(
              "flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all",
              formData.type === "cat" ? "border-[#0ea5a4] bg-[#0ea5a4]/5" : "border-neutral-200 hover:border-neutral-300"
            )}
          >
            <Cat className={cn("w-8 h-8 mb-2", formData.type === "cat" ? "text-[#0ea5a4]" : "text-neutral-400")} />
            <span className={cn("font-medium", formData.type === "cat" ? "text-[#0ea5a4]" : "text-neutral-600")}>{t.options.cat}</span>
          </button>
        </div>
      </section>

      {/* Basic Info */}
      <section className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label className={cn(errors.name && "text-red-500")}>{t.fields.name}</Label>
                <Input 
                    value={formData.name} 
                    onChange={(e) => handleChange("name", e.target.value)} 
                    placeholder={t.placeholders.name}
                    className={cn(errors.name && "border-red-500 focus-visible:ring-red-500")}
                />
            </div>
            <div className="space-y-2">
                <Label>{t.fields.weight}</Label>
                <Input 
                    type="number"
                    value={formData.weight_kg || ""} 
                    onChange={(e) => handleChange("weight_kg", Number(e.target.value))} 
                    placeholder="0"
                />
            </div>
        </div>

        <div className="space-y-2">
            <Label className={cn(errors.breed_id && "text-red-500")}>{t.fields.breed}</Label>
            <select 
                className={cn(
                    "w-full h-10 px-3 rounded-md border bg-white text-sm",
                    errors.breed_id ? "border-red-500 focus:ring-red-500" : "border-neutral-200"
                )}
                value={formData.breed_id}
                onChange={(e) => handleChange("breed_id", Number(e.target.value))}
            >
                <option value={0} disabled>{t.placeholders.selectBreed}</option>
                {breeds.map(b => (
                    <option key={b.breed_id} value={b.breed_id}>
                        {lang === 'fa' ? b.name_fa : b.name_en}
                    </option>
                ))}
            </select>
            {/* Logic for "Mixed" or Other would ideally be an option in the select or a separate toggle. 
                For now, I'll add a text input for breed_other if breed_id suggests mixed (which I don't have ID for).
                I'll just add the input always for now or skip if not critical. 
                The prompt says "load the list of breeds... use its ID". 
                I'll stick to the ID selector. */}
        </div>
        
        <div className="space-y-2">
             <Label>{t.fields.gender}</Label>
             <ChoiceGroup 
                value={formData.gender}
                onChange={(v) => handleChange("gender", v)}
                options={[
                    { label: t.options.male, value: "male" },
                    { label: t.options.female, value: "female" }
                ]}
             />
        </div>
      </section>

      {/* Details Section */}
      <section className="space-y-6">
         <h3 className="text-lg font-semibold border-b pb-2">{t.sections.details}</h3>
         
         <div className="space-y-2">
             <Label>{t.fields.microchipped}</Label>
             <div className="flex flex-wrap gap-2">
                 <button
                   type="button"
                   onClick={() => handleChange("microchip_id", formData.microchip_id ? "" : "PENDING_INPUT")}
                   className={cn(
                     "px-4 py-2 rounded-full border text-sm font-medium transition-colors",
                     formData.microchip_id
                       ? "bg-neutral-800 text-white border-neutral-800"
                       : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
                   )}
                 >
                   {t.options.microchipped}
                 </button>
                 <button
                   type="button"
                   onClick={() => handleChange("microchip_id", "")}
                   className={cn(
                     "px-4 py-2 rounded-full border text-sm font-medium transition-colors",
                     !formData.microchip_id
                       ? "bg-neutral-800 text-white border-neutral-800"
                       : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
                   )}
                 >
                   {t.options.notMicrochipped}
                 </button>
             </div>
             
             {formData.microchip_id !== "" && (
                 <div className="mt-2">
                     <Input 
                        value={formData.microchip_id === "PENDING_INPUT" ? "" : formData.microchip_id} 
                        onChange={(e) => handleChange("microchip_id", e.target.value)} 
                        placeholder={t.placeholders.microchipId}
                        className="w-full"
                     />
                 </div>
             )}
         </div>

         <div className="space-y-2">
             <Label>{t.fields.spayedNeutered}</Label>
             <ChoiceGroup 
                value={formData.is_neutered}
                onChange={(v) => handleChange("is_neutered", v)}
                options={[
                    { label: t.options.spayed, value: true },
                    { label: t.options.notSpayed, value: false }
                ]}
             />
         </div>
      </section>

      {/* Care Info */}
      <section className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">{t.sections.care}</h3>
        
        <div className="space-y-2">
             <Label>{t.fields.toiletBreak}</Label>
             <ChoiceGroup 
                value={formData.potty_schedule}
                onChange={(v) => handleChange("potty_schedule", v)}
                options={[
                    { label: t.options.everyHour, value: "Needs a toilet break every hour" },
                    { label: t.options.every2Hours, value: "Needs a toilet break every 2 hours" },
                    { label: t.options.every4Hours, value: "Needs a toilet break every 4 hours" },
                    { label: t.options.every8Hours, value: "Needs a toilet break every 8 hours" },
                    { label: t.options.specialInstructions, value: "", isCustom: true }
                ]}
                customLabel={t.fields.additionalInfoPlaceholder}
             />
        </div>

        <div className="space-y-2">
             <Label>{t.fields.energyLevel}</Label>
             <ChoiceGroup 
                value={formData.energy_level}
                onChange={(v) => handleChange("energy_level", v)}
                options={[
                    { label: t.options.highEnergy, value: "high" },
                    { label: t.options.moderateEnergy, value: "moderate" },
                    { label: t.options.lowEnergy, value: "low" }
                ]}
             />
        </div>
        
        <div className="space-y-2">
             <Label>{t.fields.feedingSchedule}</Label>
             <ChoiceGroup 
                value={formData.feeding_times}
                onChange={(v) => handleChange("feeding_times", v)}
                options={[
                    { label: t.options.morning, value: "Needs to be fed in the morning" },
                    { label: t.options.twice, value: "Needs to be fed twice a day" },
                    { label: t.options.specialFeeding, value: "", isCustom: true }
                ]}
             />
        </div>

        <div className="space-y-2">
             <Label>{t.fields.medication}</Label>
             <ChoiceGroup 
                value={formData.medications}
                onChange={(v) => handleChange("medications", v)}
                multi
                options={[
                    { label: t.options.pill, value: "Pill" },
                    { label: t.options.topical, value: "Topical" },
                    { label: t.options.injection, value: "Injection" }
                ]}
             />
        </div>
      </section>

      {/* Health Info */}
      <section className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">{t.sections.health}</h3>
        
        <div className="space-y-2">
            <Label>{t.fields.vetInfo}</Label>
            <Textarea 
                placeholder={t.fields.vetInfoPlaceholder}
                value={formData.vet_name} 
                onChange={(e) => handleChange("vet_name", e.target.value)}
            />
        </div>
        
        <div className="space-y-2">
            <Label>{t.fields.insurance}</Label>
             <ChoiceGroup 
                value={formData.insurance_provider}
                onChange={(v) => handleChange("insurance_provider", v)}
                options={[
                    { label: t.options.noInsurance, value: "None" },
                    { label: t.options.addProvider, value: "", isCustom: true }
                ]}
                customLabel={t.fields.insurancePlaceholder}
             />
        </div>
      </section>

      {/* Submit */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t flex justify-center z-10">
        <Button 
            onClick={handleSubmit} 
            disabled={loading}
            className="w-full max-w-md bg-[#0ea5a4] hover:bg-[#0b7c7b] h-12 text-lg rounded-xl"
        >
            {loading ? t.actions.saving : t.actions.save}
        </Button>
      </div>
    </div>
  );
}
