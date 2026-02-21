import { apiFetch } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-endpoints";

export interface Media {
  id: number;
  url: string;
  type: string;
}

export async function uploadMedia(accessToken: string, file: File): Promise<Media> {
  const formData = new FormData();
  formData.append("file", file);

  // Use apiFetch which handles headers and base URL correctly
  // It won't set Content-Type for FormData, allowing browser to set boundary
  return apiFetch<Media>(API_ENDPOINTS.media.upload, {
    method: "POST",
    body: formData,
    token: accessToken,
  });
}
