import { apiFetch } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-endpoints";

export interface Pet {
  pet_id: number;
  user_id: number;
  name: string;
  type: string;
  size: string;
  gender: string;
  age_display: string;
  breed_name: string;
  avatar_media_id: number;
  created_at: string;
}

export interface PetCreationPayload {
  name: string;
  pet_type: "dog" | "cat";
  photo_media_ids: number[];
  primary_photo_media_id?: number;
  gender: "male" | "female";
  breed_ids: number[];
  is_mixed_breed: boolean;
  birthday?: string; // YYYY-MM-DD
  age_years: number;
  age_months: number;
  adoption_date?: string; // YYYY-MM-DD
  dog_size: "small" | "medium" | "large" | "giant";
  weight_kg: number;

  // Enums/Strings based on user JSON
  microchipped: "microchipped" | "not_microchipped";
  spayed_neutered: "spayed_neutered" | "not_spayed_neutered";

  house_trained: "house_trained" | "not_house_trained" | "depends";
  house_trained_details?: string;

  friendly_with_children: "friendly" | "not_friendly" | "unsure" | "depends";
  friendly_with_children_details?: string;

  friendly_with_dogs: "friendly" | "not_friendly" | "unsure" | "depends";
  friendly_with_dogs_details?: string;

  friendly_with_cats: "friendly" | "not_friendly" | "unsure" | "depends";
  friendly_with_cats_details?: string;

  feeding_schedule: "morning" | "twice_a_day" | "custom";
  feeding_schedule_details?: string;

  can_be_left_alone: "one_hour_or_less" | "1_4_hours" | "4_8_hours" | "custom";
  can_be_left_alone_details?: string;

  toilet_break_schedule: "every_hour" | "every_2_hours" | "every_4_hours" | "every_8_hours" | "custom";
  toilet_break_schedule_details?: string;

  energy_level: "high" | "moderate" | "low";

  medication_pill: boolean;
  medication_pill_name?: string;
  medication_liquid: boolean;
  medication_liquid_name?: string;
  medication_injection: boolean;
  medication_injection_name?: string;
  medication_other_description?: string; // Assuming for "Other" generic desc if needed, user JSON has this field

  care_info?: string;
  veterinary_info?: string;
  pet_insurance_provider?: string;
  about_your_pet?: string;
}

export interface Breed {
  breed_id: number;
  pet_type: string;
  name_en: string;
  name_fa: string;
  typical_size: string;
}

export async function getPets(accessToken: string) {
  return apiFetch<Pet[]>(API_ENDPOINTS.pets.base, {
    method: "GET",
    token: accessToken,
  });
}

export async function createPet(accessToken: string, payload: PetCreationPayload) {
  return apiFetch<Pet>(API_ENDPOINTS.pets.base, {
    method: "POST",
    body: JSON.stringify(payload),
    token: accessToken,
  });
}

export async function getBreeds(accessToken: string, petType: "dog" | "cat", query?: string) {
  const searchParams = new URLSearchParams();
  searchParams.append("pet_type", petType);
  if (query) {
    searchParams.append("q", query);
  }

  return apiFetch<Breed[]>(`${API_ENDPOINTS.breeds.base}?${searchParams.toString()}`, {
    method: "GET",
    token: accessToken,
  });
}
