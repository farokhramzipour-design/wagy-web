import { apiFetch } from "@/lib/api-client";

export interface BookingResponse {
  booking_id: number;
  user_id: number;
  provider: {
    provider_id: number;
    business_name: string;
    user_name: string;
  };
  service: {
    provider_service_id: number;
    service_type_name: string;
  };
  pets: Array<{
    pet_id: number;
    name: string;
    type: string;
    breed_name: string;
  }>;
  booking_date: string;
  start_time: string | null;
  end_time: string | null;
  duration_hours: number | null;
  check_in_date: string | null;
  check_out_date: string | null;
  duration_nights: number | null;
  base_price: number;
  additional_pet_price: number;
  service_fee: number;
  total_price: number;
  currency: string;
  status:
    | "pending"
    | "confirmed"
    | "paid"
    | "in_progress"
    | "completed"
    | "cancelled_user"
    | "cancelled_provider"
    | "cancelled_admin"
    | "expired";
  special_requests: string | null;
  created_at: string;
  confirmed_at: string | null;
  paid_at: string | null;
  expires_at: string | null;
  payment_status: string | null;
}

export interface BookingListResponse {
  booking_id: number;
  provider_business_name: string;
  service_type_name: string;
  booking_date: string;
  number_of_pets: number;
  total_price: number;
  status: BookingResponse["status"];
  created_at: string;
}

export async function getBookings(token: string, params?: { status_filter?: string; skip?: number; limit?: number }) {
  const query = new URLSearchParams();
  if (params?.status_filter) query.set("status_filter", params.status_filter);
  if (params?.skip) query.set("skip", params.skip.toString());
  if (params?.limit) query.set("limit", params.limit.toString());

  return apiFetch<BookingListResponse[]>(`/api/v1/bookings?${query.toString()}`, { token });
}

export async function getBooking(token: string, bookingId: number) {
  return apiFetch<BookingResponse>(`/api/v1/bookings/${bookingId}`, { token });
}

export async function cancelBooking(token: string, bookingId: number, data: { reason: string; notes?: string }) {
  return apiFetch(`/api/v1/bookings/${bookingId}/cancel`, {
    token,
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function payBooking(token: string, bookingId: number) {
  return apiFetch(`/api/v1/payments/bookings/${bookingId}/pay`, {
    token,
    method: "POST",
  });
}
