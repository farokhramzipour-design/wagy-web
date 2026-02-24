export interface CharityCaseSummary {
  charity_case_id: number;
  title: string;
  status: "draft" | "pending_review" | "active" | "funded" | "closed" | "rejected";
  target_amount_minor: number;
  collected_amount_minor: number;
  remaining_minor: number;
  progress_percent: number;
  currency_code: string;
  can_accept_donations: boolean;
  cover_image_url?: string;
  province_id?: number;
  city_id?: number;
  location_text?: string;
  incident_date?: string;
  created_at: string;
  expires_at?: string;
}

export interface CharityUserSummary {
  user_id: number;
  full_name: string;
  avatar_url?: string;
  is_verified_charity: boolean;
}

export interface CaseMediaItem {
  media_id: number;
  url: string;
  type: "image" | "video";
  thumbnail_url?: string;
}

export interface CharityCaseDetail extends CharityCaseSummary {
  description: string;
  creator: CharityUserSummary;
  media: CaseMediaItem[];
  updates_count: number;
  donors_count: number;
}

export interface CreateCharityCaseRequest {
  title: string;
  description: string;
  province_id: number;
  city_id: number;
  location_text: string;
  lat: number;
  lng: number;
  target_amount_minor: number;
  currency_code: string;
  incident_date: string;
  expires_at: string;
  primary_media_id?: number;
  media_ids: number[];
}

export interface UpdateCharityCaseRequest {
  title?: string;
  description?: string;
  province_id?: number;
  city_id?: number;
  location_text?: string;
  lat?: number;
  lng?: number;
  incident_date?: string;
  expires_at?: string;
  media_ids?: number[];
}

export interface CharityCaseListResponse {
  items: CharityCaseSummary[];
  total?: number; // Admin endpoint might return total, public might be just array
}
