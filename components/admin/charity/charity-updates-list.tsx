"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { API_BASE_URL } from "@/lib/api-client";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { CharityCaseUpdate } from "@/types/charity";
import { format } from "date-fns-jalali";
import { User, Calendar, DollarSign } from "lucide-react";

const content = { en, fa };

interface CharityUpdatesListProps {
  updates: CharityCaseUpdate[];
}

export function CharityUpdatesList({ updates }: CharityUpdatesListProps) {
  const { lang } = useLanguage();
  const t = (content[lang] as any).dashboard.charity;

  // Helper for image URLs
  const getImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  if (updates.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-neutral-200">
        <p className="text-neutral-500">{t.noUpdates || "No updates found for this case."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {updates.map((update) => (
        <div key={update.charity_update_id} className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 pb-4 border-b border-neutral-100">
            <h3 className="text-xl font-bold text-neutral-800">{update.title}</h3>
            <div className="flex flex-wrap gap-4 text-sm text-neutral-500">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {update.created_at ? format(new Date(update.created_at), "yyyy/MM/dd") : "-"}
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {update.author.name}
              </div>
              {update.spent_amount_minor > 0 && (
                <div className="flex items-center gap-1.5 text-rose-600 font-medium">
                  <DollarSign className="w-4 h-4" />
                  {new Intl.NumberFormat(lang === "fa" ? "fa-IR" : "en-US").format(update.spent_amount_minor)} {update.currency_code}
                </div>
              )}
            </div>
          </div>

          <div className="prose prose-neutral max-w-none mb-6">
            <p className="text-neutral-700 whitespace-pre-wrap leading-relaxed">{update.body}</p>
          </div>

          {update.media && update.media.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
              {update.media.map((item) => (
                <div key={item.media_id} className="relative aspect-square rounded-lg overflow-hidden border border-neutral-200 group cursor-pointer">
                  <img
                    src={getImageUrl(item.thumbnail_url || item.url)}
                    alt={item.caption || "Update media"}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
