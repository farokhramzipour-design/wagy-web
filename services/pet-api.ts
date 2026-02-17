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
  type: string; // "dog" | "cat"
  size: string; // "small" | "medium" | "large" | "giant"
  breed_id: number;
  breed_other?: string;
  gender: string; // "male" | "female" | "unknown"
  date_of_birth?: string; // YYYY-MM-DD
  age_years?: number;
  weight_kg?: number;
  color?: string;
  distinctive_features?: string;
  microchip_id?: string;
  is_neutered?: boolean;
  spay_neuter_date?: string; // YYYY-MM-DD
  potty_training_status?: string; // "fully_trained" | "in_progress" | "not_trained"
  is_crate_trained?: boolean;
  knows_basic_commands?: boolean;
  energy_level?: string; // "low" | "moderate" | "high" | "hyper"
  exercise_requirements?: string;
  is_friendly_with_dogs?: boolean;
  is_friendly_with_cats?: boolean;
  is_friendly_with_kids?: boolean;
  is_friendly_with_strangers?: boolean;
  has_separation_anxiety?: boolean;
  is_reactive_on_leash?: boolean;
  behavioral_notes?: string;
  special_needs?: string;
  feeding_instructions?: string;
  food_brand?: string;
  feeding_times?: string;
  treats_allowed?: boolean;
  food_allergies?: string;
  medications?: string;
  medication_instructions?: string;
  walk_frequency?: string;
  favorite_activities?: string;
  favorite_toys?: string;
  potty_schedule?: string;
  sleep_location?: string;
  sleep_schedule?: string;
  special_instructions?: string;
  vet_clinic_name?: string;
  vet_name?: string;
  vet_phone?: string;
  vet_address?: string;
  medical_conditions?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  emergency_contact_2_name?: string;
  emergency_contact_2_phone?: string;
  has_pet_insurance?: boolean;
  insurance_provider?: string;
  insurance_policy_number?: string;
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

export async function getBreeds(accessToken: string, petType: "dog" | "cat") {
  return apiFetch<Breed[]>(`${API_ENDPOINTS.breeds.base}?pet_type=${petType}`, {
    method: "GET",
    token: accessToken,
  });
}
