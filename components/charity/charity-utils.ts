import { API_BASE_URL } from "@/lib/api-client";
import { differenceInDays, parseISO } from "date-fns-jalali";

export function calculateProgress(collected: number, target: number): number {
  if (target <= 0) return 0;
  const percent = (collected / target) * 100;
  return Math.min(Math.round(percent), 100);
}

export function getDaysLeft(expiresAt: string): number {
  const end = parseISO(expiresAt);
  const now = new Date();
  const diff = differenceInDays(end, now);
  return Math.max(diff, 0);
}

export function formatCurrency(amount: number, currency: string = "IRR", locale: string = "fa-IR"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}${url}`;
}
