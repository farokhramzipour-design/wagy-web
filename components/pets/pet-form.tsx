"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE_URL } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { uploadMedia, type Media } from "@/services/media-api";
import { createPet, deletePet, updatePet, type Pet, type PetCreationPayload } from "@/services/pet-api";
import { format, parseISO } from "date-fns";
import { Cat, Dog, Image as ImageIcon, Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { BreedSelector } from "./breed-selector";

const content = { en, fa };

interface PetFormProps {
  accessToken?: string;
  initialData?: Pet;
  petId?: string | number;
}

export function PetForm({ accessToken, initialData, petId }: PetFormProps) {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = content[lang].petForm;

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Media states
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState<Media[]>(initialData?.photos || []);
  const [profileImage, setProfileImage] = useState<Media | null>(
    initialData?.avatar_url
      ? { media_id: initialData.avatar_media_id, url: initialData.avatar_url } as unknown as Media
      : null
  );

  const initialBreedNames = initialData?.breed_names || [];

  const profileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<PetCreationPayload>(() => {
    if (initialData) {
      return {
        name: initialData.name || "",
        pet_type: (initialData.pet_type as "dog" | "cat") || "dog",
        photo_media_ids: initialData.photos?.map((p: any) => p.media_id) || [],
        primary_photo_media_id: initialData.avatar_media_id,
        gender: (initialData.gender as "male" | "female") || "male",
        breed_ids: initialData.breed_ids || [],
        is_mixed_breed: initialData.is_mixed_breed || false,
        birthday: initialData.birthday || "",
        age_years: initialData.age_years || 0,
        age_months: initialData.age_months || 0,
        adoption_date: initialData.adoption_date || "",
        dog_size: (initialData.dog_size as any) || "medium",
        weight_kg: initialData.weight_kg || 0,
        microchipped: (initialData.microchipped as any) || "not_microchipped",
        spayed_neutered: (initialData.spayed_neutered as any) || "not_spayed_neutered",
        house_trained: (initialData.house_trained as any) || "house_trained",
        house_trained_details: initialData.house_trained_details || "",
        friendly_with_children: (initialData.friendly_with_children as any) || "friendly",
        friendly_with_children_details: initialData.friendly_with_children_details || "",
        friendly_with_dogs: (initialData.friendly_with_dogs as any) || "friendly",
        friendly_with_dogs_details: initialData.friendly_with_dogs_details || "",
        friendly_with_cats: (initialData.friendly_with_cats as any) || "friendly",
        friendly_with_cats_details: initialData.friendly_with_cats_details || "",
        feeding_schedule: (initialData.feeding_schedule as any) || "morning",
        feeding_schedule_details: initialData.feeding_schedule_details || "",
        can_be_left_alone: (initialData.can_be_left_alone as any) || "one_hour_or_less",
        can_be_left_alone_details: initialData.can_be_left_alone_details || "",
        toilet_break_schedule: (initialData.toilet_break_schedule as any) || "every_hour",
        toilet_break_schedule_details: initialData.toilet_break_schedule_details || "",
        energy_level: (initialData.energy_level as any) || "moderate",
        medication_pill: initialData.medication_pill || false,
        medication_pill_name: initialData.medication_pill_name || "",
        medication_liquid: initialData.medication_liquid || false,
        medication_liquid_name: initialData.medication_liquid_name || "",
        medication_injection: initialData.medication_injection || false,
        medication_injection_name: initialData.medication_injection_name || "",
        medication_other_description: initialData.medication_other_description || "",
        care_info: initialData.care_info || "",
        veterinary_info: initialData.veterinary_info || "",
        pet_insurance_provider: initialData.pet_insurance_provider || "",
        about_your_pet: initialData.about_your_pet || ""
      };
    }
    return {
      name: "",
      pet_type: "dog",
      photo_media_ids: [],
      primary_photo_media_id: undefined,
      gender: "male",
      breed_ids: [],
      is_mixed_breed: false,
      birthday: "",
      age_years: 0,
      age_months: 0,
      adoption_date: "",
      dog_size: "medium",
      weight_kg: 0,
      microchipped: "not_microchipped",
      spayed_neutered: "not_spayed_neutered",
      house_trained: "house_trained",
      house_trained_details: "",
      friendly_with_children: "friendly",
      friendly_with_children_details: "",
      friendly_with_dogs: "friendly",
      friendly_with_dogs_details: "",
      friendly_with_cats: "friendly",
      friendly_with_cats_details: "",
      feeding_schedule: "morning",
      feeding_schedule_details: "",
      can_be_left_alone: "one_hour_or_less",
      can_be_left_alone_details: "",
      toilet_break_schedule: "every_hour",
      toilet_break_schedule_details: "",
      energy_level: "moderate",
      medication_pill: false,
      medication_pill_name: "",
      medication_liquid: false,
      medication_liquid_name: "",
      medication_injection: false,
      medication_injection_name: "",
      medication_other_description: "",
      care_info: "",
      veterinary_info: "",
      pet_insurance_provider: "",
      about_your_pet: ""
    };
  });

  const handleChange = (field: keyof PetCreationPayload, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Breed Logic
  const handleBreedChange = (index: number, breedId: number) => {
    // Check for duplicates
    if (formData.breed_ids.some((id, i) => id === breedId && i !== index)) {
      toast.error(lang === 'fa' ? "این نژاد قبلا انتخاب شده است" : "This breed is already selected");
      return;
    }
    const newBreeds = [...formData.breed_ids];
    newBreeds[index] = breedId;
    handleChange("breed_ids", newBreeds);
  };

  const addBreed = () => {
    handleChange("breed_ids", [...formData.breed_ids, 0]);
  };

  const removeBreed = (index: number) => {
    const newBreeds = formData.breed_ids.filter((_, i) => i !== index);
    handleChange("breed_ids", newBreeds);
  };

  // Handle mixed breed toggle
  const handleMixedBreedToggle = (checked: boolean) => {
    handleChange("is_mixed_breed", checked);
    if (!checked) {
      // If turning off mixed breed, keep only the first selected breed
      if (formData.breed_ids.length > 0) {
        handleChange("breed_ids", [formData.breed_ids[0]]);
      }
    } else {
      // If turning on, ensure at least one slot exists
      if (formData.breed_ids.length === 0) {
        handleChange("breed_ids", [0]);
      }
    }
  };

  // Media Logic
  const getImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !accessToken) return;

    try {
      setUploadingProfile(true);
      const file = e.target.files[0];
      const media = await uploadMedia(accessToken, file);

      setProfileImage(media);
      setFormData(prev => ({
        ...prev,
        primary_photo_media_id: media.media_id,
        // Add to gallery if not there? usually primary is separate or part of gallery.
        // Let's add it to photo_media_ids as well to be safe
        photo_media_ids: Array.from(new Set([...prev.photo_media_ids, media.media_id]))
      }));
      toast.success("Profile photo uploaded");
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Failed to upload photo");
    } finally {
      setUploadingProfile(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !accessToken) return;

    try {
      setUploadingGallery(true);
      const files = Array.from(e.target.files);
      const newMediaIds: number[] = [];
      const newMediaObjects: Media[] = [];

      for (const file of files) {
        const media = await uploadMedia(accessToken, file);
        newMediaIds.push(media.media_id);
        newMediaObjects.push(media);
      }

      setGalleryImages(prev => [...prev, ...newMediaObjects]);
      setFormData(prev => ({
        ...prev,
        photo_media_ids: [...prev.photo_media_ids, ...newMediaIds]
      }));
      toast.success(`${files.length} photo(s) uploaded`);
    } catch (error) {
      console.error("Gallery upload failed", error);
      toast.error("Failed to upload photos");
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (mediaId: number) => {
    setGalleryImages(prev => prev.filter(m => m.media_id !== mediaId));
    setFormData(prev => ({
      ...prev,
      photo_media_ids: prev.photo_media_ids.filter(id => id !== mediaId),
      primary_photo_media_id: prev.primary_photo_media_id === mediaId ? undefined : prev.primary_photo_media_id
    }));
    if (profileImage?.media_id === mediaId) {
      setProfileImage(null);
    }
  };

  const handleDelete = async () => {
    if (!accessToken || !petId) return;
    if (!confirm(t.delete.confirm)) return;

    setLoading(true);
    try {
      await deletePet(petId, accessToken);
      toast.success(t.validation.deleteSuccess);
      router.push("/app/pets");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete pet", error);
      toast.error(t.validation.deleteError);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!accessToken) return;

    // Validation
    const newErrors: Record<string, boolean> = {};
    if (!formData.name.trim()) newErrors.name = true;
    if (formData.breed_ids.length === 0 || formData.breed_ids.some(id => id === 0)) newErrors.breed_ids = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.name) toast.error(t.validation.nameRequired);
      else if (newErrors.breed_ids) toast.error(t.validation.breedRequired);
      return;
    }

    setLoading(true);
    setErrors({});

    // Clean up derived fields logic if needed
    const payload = { ...formData };

    // Ensure numeric values
    payload.age_years = Number(payload.age_years);
    payload.age_months = Number(payload.age_months);
    payload.weight_kg = Number(payload.weight_kg);

    // Filter photo_media_ids to remove null/undefined values
    payload.photo_media_ids = payload.photo_media_ids.filter((id) => id !== null && id !== undefined);

    // Ensure primary_photo_media_id is set
    if (!payload.primary_photo_media_id) {
      if (payload.photo_media_ids.length > 0) {
        payload.primary_photo_media_id = payload.photo_media_ids[0];
      } else {
        payload.primary_photo_media_id = 0;
      }
    }

    try {
      if (petId) {
        await updatePet(petId, payload, accessToken);
        toast.success(lang === 'fa' ? "اطلاعات با موفقیت بروزرسانی شد" : "Pet updated successfully");
      } else {
        await createPet(accessToken, payload);
        toast.success(t.validation.success);
      }
      router.push("/app/pets");
      router.refresh();
    } catch (error) {
      console.error("Failed to save pet", error);
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
    detailsValue,
    onDetailsChange,
    detailsPlaceholder
  }: {
    options: { label: string, value: any, hasDetails?: boolean }[],
    value: any,
    onChange: (val: any) => void,
    detailsValue?: string,
    onDetailsChange?: (val: string) => void,
    detailsPlaceholder?: string
  }) => {
    const selectedOption = options.find(o => o.value === value);
    const showDetails = selectedOption?.hasDetails;

    const handleOptionClick = (val: any) => {
      onChange(val);
      // Clear details if switching to an option that doesn't have details
      const newOption = options.find(o => o.value === val);
      if (!newOption?.hasDetails && onDetailsChange) {
        onDetailsChange("");
      }
    };

    return (
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => handleOptionClick(opt.value)}
              className={cn(
                "px-4 py-2 rounded-full border text-sm font-medium transition-colors",
                value === opt.value
                  ? "bg-neutral-800 text-white border-neutral-800"
                  : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {showDetails && onDetailsChange && (
          <Textarea
            value={detailsValue}
            onChange={(e) => onDetailsChange(e.target.value)}
            placeholder={detailsPlaceholder || t.placeholders.details}
            className="w-full mt-2"
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-20 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-neutral-800">{t.title}</h1>
        <p className="text-neutral-500">{t.subtitle}</p>
      </div>

      {/* Top Profile Image */}
      <div className="flex justify-center">
        <div
          className="relative w-32 h-32 rounded-full bg-neutral-100 border-2 border-dashed border-neutral-300 flex items-center justify-center cursor-pointer hover:bg-neutral-50 overflow-hidden"
          onClick={() => profileInputRef.current?.click()}
        >
          {profileImage ? (
            <img src={getImageUrl(profileImage.url)} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center text-neutral-400">
              {uploadingProfile ? <Loader2 className="w-8 h-8 animate-spin mx-auto" /> : <ImageIcon className="w-8 h-8 mx-auto mb-1" />}
              <span className="text-xs">{uploadingProfile ? t.fields.uploading : t.fields.addPhoto}</span>
            </div>
          )}
          <input
            type="file"
            ref={profileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleProfileUpload}
          />
        </div>
      </div>

      {/* Type Selection */}
      <section className="space-y-4">
        <Label>{t.fields.type}</Label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleChange("pet_type", "dog")}
            className={cn(
              "flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all",
              formData.pet_type === "dog" ? "border-[#0ea5a4] bg-[#0ea5a4]/5" : "border-neutral-200 hover:border-neutral-300"
            )}
          >
            <Dog className={cn("w-8 h-8 mb-2", formData.pet_type === "dog" ? "text-[#0ea5a4]" : "text-neutral-400")} />
            <span className={cn("font-medium", formData.pet_type === "dog" ? "text-[#0ea5a4]" : "text-neutral-600")}>{t.options.dog}</span>
          </button>
          <button
            type="button"
            onClick={() => handleChange("pet_type", "cat")}
            className={cn(
              "flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all",
              formData.pet_type === "cat" ? "border-[#0ea5a4] bg-[#0ea5a4]/5" : "border-neutral-200 hover:border-neutral-300"
            )}
          >
            <Cat className={cn("w-8 h-8 mb-2", formData.pet_type === "cat" ? "text-[#0ea5a4]" : "text-neutral-400")} />
            <span className={cn("font-medium", formData.pet_type === "cat" ? "text-[#0ea5a4]" : "text-neutral-600")}>{t.options.cat}</span>
          </button>
        </div>
      </section>

      {/* Pet Details */}
      <section className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">{t.sections.details}</h3>

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
              onChange={(e) => handleChange("weight_kg", e.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>{t.fields.age} ({t.fields.years})</Label>
            <Input
              type="number"
              value={formData.age_years}
              onChange={(e) => handleChange("age_years", e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label>{t.fields.age} ({t.fields.months})</Label>
            <Input
              type="number"
              value={formData.age_months}
              onChange={(e) => handleChange("age_months", e.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t.fields.birthday}</Label>
          <DatePicker
            date={formData.birthday ? parseISO(formData.birthday) : undefined}
            setDate={(date) => handleChange("birthday", date ? format(date, "yyyy-MM-dd") : "")}
            locale={lang as "en" | "fa"}
            placeholder={t.fields.birthday}
          />
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

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className={cn(errors.breed_ids && "text-red-500")}>{t.fields.breed}</Label>
            <div className="flex items-center gap-2">
              <Label htmlFor="mixed-breed" className="font-normal text-sm text-muted-foreground">{t.fields.mixedBreed}</Label>
              <Switch
                checked={formData.is_mixed_breed}
                onCheckedChange={handleMixedBreedToggle}
                id="mixed-breed"
              />
            </div>
          </div>

          <div className="space-y-3">
            {formData.breed_ids.length === 0 && (
              <Button type="button" variant="outline" size="sm" onClick={() => handleChange("breed_ids", [0])} className="w-full">
                {t.placeholders.selectBreed}
              </Button>
            )}

            {formData.breed_ids.map((breedId, index) => (
              <div key={index} className="flex gap-2">
                <div className="flex-1">
                  <BreedSelector
                    value={breedId}
                    onChange={(id) => handleBreedChange(index, id)}
                    petType={formData.pet_type}
                    accessToken={accessToken}
                    excludeIds={formData.breed_ids.filter((_, i) => i !== index)}
                    placeholder={t.placeholders.selectBreed}
                    error={!!errors.breed_ids}
                    initialName={initialBreedNames[index]}
                  />
                </div>
                {formData.is_mixed_breed && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBreed(index)}
                    disabled={formData.breed_ids.length <= 1}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}

            {formData.is_mixed_breed && (
              <Button type="button" variant="outline" size="sm" onClick={addBreed} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                {t.fields.addBreed}
              </Button>
            )}
          </div>
        </div>

        {formData.pet_type === "dog" && (
          <div className="space-y-2">
            <Label>{t.fields.size}</Label>
            <ChoiceGroup
              value={formData.dog_size}
              onChange={(v) => handleChange("dog_size", v)}
              options={[
                { label: t.options.small, value: "small" },
                { label: t.options.medium, value: "medium" },
                { label: t.options.large, value: "large" },
                { label: t.options.giant, value: "giant" }
              ]}
            />
          </div>
        )}
      </section>

      {/* Additional Details */}
      <section className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">{t.sections.additional}</h3>

        <div className="space-y-2">
          <Label>{t.fields.microchipped}</Label>
          <ChoiceGroup
            value={formData.microchipped}
            onChange={(v) => handleChange("microchipped", v)}
            options={[
              { label: t.options.microchipped, value: "microchipped" },
              { label: t.options.notMicrochipped, value: "not_microchipped" }
            ]}
          />
        </div>

        <div className="space-y-2">
          <Label>{t.fields.spayedNeutered}</Label>
          <ChoiceGroup
            value={formData.spayed_neutered}
            onChange={(v) => handleChange("spayed_neutered", v)}
            options={[
              { label: t.options.spayed, value: "spayed_neutered" },
              { label: t.options.notSpayed, value: "not_spayed_neutered" }
            ]}
          />
        </div>

        <div className="space-y-2">
          <Label>{t.fields.houseTrained}</Label>
          <ChoiceGroup
            value={formData.house_trained}
            onChange={(v) => handleChange("house_trained", v)}
            detailsValue={formData.house_trained_details}
            onDetailsChange={(v) => handleChange("house_trained_details", v)}
            options={[
              { label: t.options.houseTrained, value: "house_trained" },
              { label: t.options.notHouseTrained, value: "not_house_trained" },
              { label: t.options.dependsHouseTrained, value: "depends", hasDetails: true }
            ]}
          />
        </div>

        <div className="space-y-2">
          <Label>{t.fields.friendlyChildren}</Label>
          <ChoiceGroup
            value={formData.friendly_with_children}
            onChange={(v) => handleChange("friendly_with_children", v)}
            detailsValue={formData.friendly_with_children_details}
            onDetailsChange={(v) => handleChange("friendly_with_children_details", v)}
            options={[
              { label: t.options.friendly, value: "friendly" },
              { label: t.options.notFriendly, value: "not_friendly" },
              { label: t.options.unsure, value: "unsure" },
              { label: t.options.depends, value: "depends", hasDetails: true }
            ]}
          />
        </div>

        <div className="space-y-2">
          <Label>{t.fields.friendlyDogs}</Label>
          <ChoiceGroup
            value={formData.friendly_with_dogs}
            onChange={(v) => handleChange("friendly_with_dogs", v)}
            detailsValue={formData.friendly_with_dogs_details}
            onDetailsChange={(v) => handleChange("friendly_with_dogs_details", v)}
            options={[
              { label: t.options.friendly, value: "friendly" },
              { label: t.options.notFriendly, value: "not_friendly" },
              { label: t.options.unsure, value: "unsure" },
              { label: t.options.depends, value: "depends", hasDetails: true }
            ]}
          />
        </div>

        <div className="space-y-2">
          <Label>{t.fields.friendlyCats}</Label>
          <ChoiceGroup
            value={formData.friendly_with_cats}
            onChange={(v) => handleChange("friendly_with_cats", v)}
            detailsValue={formData.friendly_with_cats_details}
            onDetailsChange={(v) => handleChange("friendly_with_cats_details", v)}
            options={[
              { label: t.options.friendly, value: "friendly" },
              { label: t.options.notFriendly, value: "not_friendly" },
              { label: t.options.unsure, value: "unsure" },
              { label: t.options.depends, value: "depends", hasDetails: true }
            ]}
          />
        </div>

        <div className="space-y-2">
          <Label>{t.fields.adoptionDate}</Label>
          <DatePicker
            date={formData.adoption_date ? parseISO(formData.adoption_date) : undefined}
            setDate={(date) => handleChange("adoption_date", date ? format(date, "yyyy-MM-dd") : "")}
            locale={lang as "en" | "fa"}
            placeholder={t.fields.adoptionDate}
          />
        </div>

        <div className="space-y-2">
          <Label>{t.fields.about}</Label>
          <Textarea
            value={formData.about_your_pet}
            onChange={(e) => handleChange("about_your_pet", e.target.value)}
            placeholder={t.fields.aboutPlaceholder}
          />
        </div>
      </section>

      {/* Care Info */}
      <section className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">{t.sections.care}</h3>

        <div className="space-y-2">
          <Label>{t.fields.toiletBreak}</Label>
          <ChoiceGroup
            value={formData.toilet_break_schedule}
            onChange={(v) => handleChange("toilet_break_schedule", v)}
            detailsValue={formData.toilet_break_schedule_details}
            onDetailsChange={(v) => handleChange("toilet_break_schedule_details", v)}
            options={[
              { label: t.options.everyHour, value: "every_hour" },
              { label: t.options.every2Hours, value: "every_2_hours" },
              { label: t.options.every4Hours, value: "every_4_hours" },
              { label: t.options.every8Hours, value: "every_8_hours" },
              { label: t.options.customToilet, value: "custom", hasDetails: true }
            ]}
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
            value={formData.feeding_schedule}
            onChange={(v) => handleChange("feeding_schedule", v)}
            detailsValue={formData.feeding_schedule_details}
            onDetailsChange={(v) => handleChange("feeding_schedule_details", v)}
            options={[
              { label: t.options.morning, value: "morning" },
              { label: t.options.twice, value: "twice_a_day" },
              { label: t.options.customFeeding, value: "custom", hasDetails: true }
            ]}
          />
        </div>

        <div className="space-y-2">
          <Label>{t.fields.alone}</Label>
          <ChoiceGroup
            value={formData.can_be_left_alone}
            onChange={(v) => handleChange("can_be_left_alone", v)}
            detailsValue={formData.can_be_left_alone_details}
            onDetailsChange={(v) => handleChange("can_be_left_alone_details", v)}
            options={[
              { label: t.options.oneHour, value: "one_hour_or_less" },
              { label: t.options.oneToFourHours, value: "1_4_hours" },
              { label: t.options.fourToEightHours, value: "4_8_hours" },
              { label: t.options.customAlone, value: "custom", hasDetails: true }
            ]}
          />
        </div>

        <div className="space-y-4">
          <Label>{t.fields.medication}</Label>
          <div className="flex flex-col gap-4">
            {/* Pill */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.medication_pill}
                  onCheckedChange={(c) => handleChange("medication_pill", c)}
                />
                <span>{t.options.pill}</span>
              </div>
              {formData.medication_pill && (
                <Input
                  placeholder={t.fields.medicationName}
                  value={formData.medication_pill_name}
                  onChange={(e) => handleChange("medication_pill_name", e.target.value)}
                />
              )}
            </div>

            {/* Liquid */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.medication_liquid}
                  onCheckedChange={(c) => handleChange("medication_liquid", c)}
                />
                <span>{t.options.topical}</span>
              </div>
              {formData.medication_liquid && (
                <Input
                  placeholder={t.fields.medicationName}
                  value={formData.medication_liquid_name}
                  onChange={(e) => handleChange("medication_liquid_name", e.target.value)}
                />
              )}
            </div>

            {/* Injection */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.medication_injection}
                  onCheckedChange={(c) => handleChange("medication_injection", c)}
                />
                <span>{t.options.injection}</span>
              </div>
              {formData.medication_injection && (
                <Input
                  placeholder={t.fields.medicationName}
                  value={formData.medication_injection_name}
                  onChange={(e) => handleChange("medication_injection_name", e.target.value)}
                />
              )}
            </div>

            {/* Other */}
            <div className="space-y-2">
              <Label className="font-normal text-sm text-muted-foreground">{t.options.otherMedication}</Label>
              <Input
                placeholder={t.fields.medicationDesc}
                value={formData.medication_other_description}
                onChange={(e) => handleChange("medication_other_description", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t.fields.additionalInfo}</Label>
          <Textarea
            value={formData.care_info}
            onChange={(e) => handleChange("care_info", e.target.value)}
            placeholder={t.fields.additionalInfoPlaceholder}
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
            value={formData.veterinary_info}
            onChange={(e) => handleChange("veterinary_info", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>{t.fields.insurance}</Label>
          <ChoiceGroup
            value={formData.pet_insurance_provider === "" ? "None" : "Provider"}
            onChange={(v) => {
              if (v === "None") handleChange("pet_insurance_provider", "");
              else handleChange("pet_insurance_provider", "Pending Input");
            }}
            detailsValue={formData.pet_insurance_provider === "Pending Input" ? "" : formData.pet_insurance_provider}
            onDetailsChange={(v) => handleChange("pet_insurance_provider", v)}
            options={[
              { label: t.options.noInsurance, value: "None" },
              { label: t.options.addProvider, value: "Provider", hasDetails: true }
            ]}
            detailsPlaceholder={t.fields.insurancePlaceholder}
          />
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">{t.sections.gallery}</h3>
        <p className="text-sm text-muted-foreground">{t.fields.photoGallery}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {galleryImages.map((media) => (
            <div key={media.media_id} className="relative aspect-square rounded-lg overflow-hidden border">
              <img src={getImageUrl(media.url)} alt="Gallery" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeGalleryImage(media.media_id)}
                className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full p-1"
              >
                <X className="w-4 h-4" />
              </button>
              {formData.primary_photo_media_id === media.media_id && (
                <div className="absolute bottom-0 left-0 right-0 bg-green-500/80 text-white text-xs text-center py-1">
                  Primary
                </div>
              )}
            </div>
          ))}

          <div
            className="aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-neutral-400 bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer"
            onClick={() => galleryInputRef.current?.click()}
          >
            {uploadingGallery ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <>
                <Upload className="w-8 h-8 mb-2" />
                <span className="text-xs">{t.fields.addPhoto}</span>
              </>
            )}
            <input
              type="file"
              ref={galleryInputRef}
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleGalleryUpload}
            />
          </div>
        </div>
      </section>

      {/* Submit */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t flex justify-center items-center gap-4 z-10">
        {petId && (
          <Button
            onClick={handleDelete}
            variant="destructive"
            disabled={loading || uploadingProfile || uploadingGallery}
            className="w-full max-w-[200px] h-12 text-lg rounded-xl"
          >
            {t.actions.delete}
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          disabled={loading || uploadingProfile || uploadingGallery}
          className="w-full max-w-md bg-[#0ea5a4] hover:bg-[#0b7c7b] h-12 text-lg rounded-xl"
        >
          {loading ? t.actions.saving : (petId ? t.actions.update : t.actions.save)}
        </Button>
      </div>
    </div>
  );
}
