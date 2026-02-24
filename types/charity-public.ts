export interface CharityCase {
  charity_case_id: number;
  title: string;
  status: string;
  primary_media_id: number;
  target_amount_minor: number;
  collected_amount_minor: number;
  remaining_minor: number;
  progress_percent: number;
  currency_code: string;
  expires_at: string;
  can_accept_donations: boolean;
  cover_image_url: string;
  province_id: number;
  city_id: number;
  location_text: string;
  incident_date: string;
  created_at: string;
  can_edit: boolean;
  can_delete: boolean;
  can_submit: boolean;
}

export interface CharityMedia {
  media_id: number;
  url: string;
  thumbnail_url: string;
  caption: string;
  sort_order: number;
}

export interface CharityCreator {
  user_id: number;
  name: string;
  avatar_url: string;
}

export interface CharityUpdate {
  charity_update_id: number;
  charity_case_id: number;
  title: string;
  body: string;
  spent_amount_minor: number;
  currency_code: string;
  media: CharityMedia[];
  author: CharityCreator;
  created_at: string;
}

export interface CharityCaseDetails extends CharityCase {
  description: string;
  creator: CharityCreator;
  media: CharityMedia[];
  updates_count: number;
  donors_count: number;
  updates: CharityUpdate[];
}

export interface CharityDonation {
  donation_id: number;
  amount_minor: number;
  currency_code: string;
  donor_name: string;
  created_at: string;
}

export interface DonatePayload {
  charity_case_id: number;
  amount_minor: number;
  currency_code: string;
}
