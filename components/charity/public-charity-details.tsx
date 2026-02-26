"use client";

import { calculateProgress, formatCurrency, getDaysLeft, getImageUrl } from "@/components/charity/charity-utils";
import { DonationWidget } from "@/components/charity/donation-widget";
import { Lightbox } from "@/components/ui/lightbox";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { charityPublicApi } from "@/services/charity-public-api";
import { CharityCaseDetails, CharityDonation } from "@/types/charity-public";
import { format } from "date-fns-jalali";
import {
  AlertCircle,
  Calendar,
  ChevronLeft,
  Clock,
  Heart,
  Home,
  Share2,
  User,
  AlertTriangle
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const content = { en, fa };

interface PublicCharityDetailsProps {
  id: number;
  isLoggedIn: boolean;
}

export function PublicCharityDetails({ id, isLoggedIn }: PublicCharityDetailsProps) {
  const { lang } = useLanguage();
  const t = (content[lang] as any).charity;
  const common = (content[lang] as any).common;

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<CharityCaseDetails | null>(null);
  const [donations, setDonations] = useState<CharityDonation[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    fetchDetails();
    fetchDonations();
  }, [id]);

  const fetchDetails = async () => {
    try {
      const data = await charityPublicApi.getCaseDetails(id);
      setDetails(data);
    } catch (error) {
      console.error("Failed to fetch details", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDonations = async () => {
    try {
      const data = await charityPublicApi.getCaseDonations(id);
      setDonations(data || []);
    } catch (error) {
      console.error("Failed to fetch donations", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#f0f4f6]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0ea5a4]"></div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-bold text-[#103745]">Case not found</h1>
        <Link href="/charity">
          <Button variant="link" className="text-[#0ea5a4] mt-4">
            {common.back}
          </Button>
        </Link>
      </div>
    );
  }

  const progress = calculateProgress(details.collected_amount_minor, details.target_amount_minor);
  const daysLeft = getDaysLeft(details.expires_at);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: details.title,
        text: details.description,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success(lang === "fa" ? "لینک کپی شد" : "Link copied to clipboard");
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f0f4f6] text-[#103745] pb-20">
      
      {/* BREADCRUMB */}
      <div className="max-w-[1280px] mx-auto pt-4 px-6 flex items-center gap-2 text-[13px] text-[#6b8a93]">
        <Link href="/" className="hover:text-[#0ea5a4] transition-colors flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          {lang === "fa" ? "خانه" : "Home"}
        </Link>
        <ChevronLeft className="w-3.5 h-3.5" />
        <Link href="/charity" className="hover:text-[#0ea5a4] transition-colors">
          {lang === "fa" ? "خیریه" : "Charity"}
        </Link>
        <ChevronLeft className="w-3.5 h-3.5" />
        <span className="text-[#3d5a63] font-medium truncate max-w-[200px]">{details.title}</span>
      </div>

      {/* HERO BANNER */}
      <div className="max-w-[1280px] mx-auto mt-3.5 px-6 animate-[fadeUp_0.5s_ease_both]">
        <div className="relative w-full h-[420px] rounded-[24px] overflow-hidden bg-gradient-to-br from-[#0a4050] via-[#0b6060] to-[#1a9b8a]">
          {details.cover_image_url ? (
             <Image
             src={getImageUrl(details.cover_image_url)}
             alt={details.title}
             fill
             className="object-cover opacity-70 mix-blend-luminosity"
             priority
           />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[120px] opacity-15 select-none">🐕</div>
          )}
         
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a2028f2] via-[#0a202880] to-[#0a20281a]"></div>
          
          {/* Pattern overlay if needed */}
          <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[size:28px_28px]"></div>

          <div className="absolute bottom-0 right-0 left-0 p-8 md:p-9 flex flex-col md:flex-row items-end justify-between gap-5">
            <div className="flex flex-col gap-3 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-[20px] bg-[rgba(74,222,128,0.2)] text-[#4ade80] border border-[rgba(74,222,128,0.3)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse"></span>
                  {details.status === "active" ? (lang === "fa" ? "در جریان" : "Active") : details.status}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-[20px] bg-[rgba(14,165,164,0.2)] text-[#2dd4bf] border border-[rgba(14,165,164,0.3)]">
                  🐾 {lang === "fa" ? "حیوانات آسیب‌دیده" : "Injured Animals"}
                </span>
              </div>
              
              <h1 className="text-[clamp(22px,3vw,38px)] font-black text-white leading-tight tracking-tight max-w-[680px]">
                {details.title}
              </h1>

              <div className="flex items-center gap-5 flex-wrap mt-1">
                <div className="flex items-center gap-1.5 text-[13px] text-[rgba(255,255,255,0.65)]">
                  <User className="w-3.5 h-3.5 opacity-80" />
                  <span>{details.creator.name}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[13px] text-[rgba(255,255,255,0.65)]">
                  <Calendar className="w-3.5 h-3.5 opacity-80" />
                  <span>{format(new Date(details.created_at), "yyyy/MM/dd")}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[13px] text-[rgba(255,255,255,0.65)]">
                  <Clock className="w-3.5 h-3.5 opacity-80" />
                  <span>{daysLeft} {t.daysLeft}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 shrink-0">
              <button 
                onClick={handleShare}
                className="flex items-center gap-1.5 bg-[rgba(255,255,255,0.12)] backdrop-blur-md border border-[rgba(255,255,255,0.2)] text-white py-2.5 px-4 rounded-[10px] text-[13px] font-semibold cursor-pointer transition-all hover:bg-[rgba(255,255,255,0.2)]"
              >
                <Share2 className="w-3.5 h-3.5" />
                {t.share}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="max-w-[1280px] mx-auto mt-5 mb-10 px-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 items-start">
        
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-4">
          
          {/* Progress Card */}
          <div className="bg-white rounded-[20px] border border-[#dce6e8] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06),0_2px_12px_rgba(0,0,0,0.04)] animate-[fadeUp_0.5s_0.1s_ease_both]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[32px] font-black text-[#ff6b6b] tracking-tighter">
                {progress}%
              </span>
              <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[#6b8a93] bg-[#fff3e0] px-3 py-1.5 rounded-[20px]">
                <Clock className="w-3.5 h-3.5" />
                <span>{daysLeft} {t.daysLeft}</span>
              </div>
            </div>

            <div className="h-2.5 bg-[#f0f4f5] rounded-full overflow-hidden mb-4">
              <div 
                className="h-full rounded-full bg-gradient-to-l from-[#ff6b6b] to-[#2EC4B6] transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#f7fbfb] border border-[#dce6e8] rounded-xl p-3 text-center">
                <span className="block text-base font-extrabold text-[#103745] mb-1">
                  {formatCurrency(details.target_amount_minor, details.currency_code, lang === "fa" ? "fa-IR" : "en-US")}
                </span>
                <span className="text-[11px] font-semibold text-[#6b8a93]">{t.target}</span>
              </div>
              <div className="bg-[#f7fbfb] border border-[#dce6e8] rounded-xl p-3 text-center">
                <span className="block text-base font-extrabold text-[#0b7c7b] mb-1">
                  {formatCurrency(details.collected_amount_minor, details.currency_code, lang === "fa" ? "fa-IR" : "en-US")}
                </span>
                <span className="text-[11px] font-semibold text-[#6b8a93]">{t.collected}</span>
              </div>
              <div className="bg-[#f7fbfb] border border-[#dce6e8] rounded-xl p-3 text-center">
                <span className="block text-base font-extrabold text-[#103745] mb-1">
                  {details.donors_count}
                </span>
                <span className="text-[11px] font-semibold text-[#6b8a93]">{t.donors}</span>
              </div>
            </div>
          </div>

          {/* Story Section */}
          <div className="bg-white rounded-[20px] border border-[#dce6e8] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06),0_2px_12px_rgba(0,0,0,0.04)] animate-[fadeUp_0.5s_0.15s_ease_both]">
            <div className="flex items-center gap-2 text-[11px] font-extrabold text-[#0ea5a4] uppercase tracking-wider mb-3">
              <span className="w-0.5 h-3.5 bg-gradient-to-b from-[#0ea5a4] to-[#2dd4bf] rounded-sm"></span>
              {t.story}
            </div>
            <h2 className="text-lg font-extrabold text-[#103745] mb-2.5">
              {details.title}
            </h2>
            <p className="text-[15px] text-[#3d5a63] leading-relaxed whitespace-pre-wrap">
              {details.description}
            </p>

            {/* Gallery */}
            {details.media && details.media.length > 0 && (
              <div className="grid grid-cols-3 gap-2.5 mt-6">
                {details.media.map((media, index) => (
                  <div 
                    key={media.media_id} 
                    onClick={() => openLightbox(index)}
                    className={cn(
                      "aspect-[4/3] rounded-xl overflow-hidden cursor-pointer relative bg-gradient-to-br from-[#e0f7f7] to-[#b2ebf2] border border-[#dce6e8] group",
                      index === 0 ? "col-span-2 aspect-[16/9]" : ""
                    )}
                  >
                    <Image
                      src={getImageUrl(media.thumbnail_url || media.url)}
                      alt={media.caption || "Charity media"}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[#0ea5a4] opacity-0 group-hover:opacity-15 transition-opacity duration-300 rounded-xl"></div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Updates Section */}
          {details.updates && details.updates.length > 0 && (
            <div className="bg-white rounded-[20px] border border-[#dce6e8] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06),0_2px_12px_rgba(0,0,0,0.04)] animate-[fadeUp_0.5s_0.2s_ease_both]">
               <div className="flex items-center gap-2 text-[11px] font-extrabold text-[#0ea5a4] uppercase tracking-wider mb-6">
                <span className="w-0.5 h-3.5 bg-gradient-to-b from-[#0ea5a4] to-[#2dd4bf] rounded-sm"></span>
                {t.updates}
              </div>
              
              <div className="flex flex-col gap-0">
                {details.updates.map((update, index) => (
                  <div key={update.charity_update_id} className="flex gap-4 pb-5 relative group">
                    {index !== details.updates!.length - 1 && (
                      <div className="absolute right-[15px] top-[34px] bottom-0 w-[1.5px] bg-[#dce6e8]"></div>
                    )}
                    <div className="w-8 h-8 rounded-full bg-[#e0f7f7] border-2 border-[#0ea5a4] flex items-center justify-center shrink-0 text-[13px] z-10 text-[#0b7c7b]">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[11px] font-bold text-[#6b8a93] mb-1 uppercase tracking-wide">
                        {format(new Date(update.created_at), "yyyy/MM/dd")}
                      </div>
                      <div className="text-sm text-[#3d5a63] leading-relaxed bg-[#f7fbfb] border border-[#dce6e8] rounded-xl p-3">
                        <h4 className="font-bold text-[#103745] mb-1">{update.title}</h4>
                        <p>{update.body}</p>
                        {update.media && update.media.length > 0 && (
                          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                            {update.media.map((m) => (
                              <div key={m.media_id} className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-[#dce6e8]">
                                <Image src={getImageUrl(m.thumbnail_url || m.url)} alt={m.caption} fill className="object-cover" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT SIDEBAR */}
        <div className="flex flex-col gap-4 sticky top-[80px]">
          
          {/* Donation Widget */}
          <DonationWidget 
            caseId={details.charity_case_id} 
            currency={details.currency_code}
            isLoggedIn={isLoggedIn}
          />

          {/* Donors List */}
          <div className="bg-white rounded-[20px] border border-[#dce6e8] p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06),0_2px_12px_rgba(0,0,0,0.04)] animate-[fadeUp_0.5s_0.3s_ease_both]">
            <h4 className="text-sm font-extrabold text-[#103745] mb-3.5 flex items-center justify-between">
              <span>{lang === "fa" ? "حامیان اخیر" : "Recent Donors"}</span>
              <span className="text-[11px] font-semibold text-[#0ea5a4] bg-[#e0f7f7] px-2 py-0.5 rounded-[20px]">
                {donations.length}
              </span>
            </h4>

            {donations.length > 0 ? (
              <div className="flex flex-col">
                {donations.slice(0, 5).map((donation) => (
                  <div key={donation.donation_id} className="flex items-center gap-2.5 py-2 border-b border-[#f0f6f7] last:border-0">
                    <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-[#e0f7f7] to-[#b2ebf2] flex items-center justify-center text-[13px] font-extrabold text-[#0b7c7b] shrink-0">
                      {donation.donor_name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-bold text-[#103745] truncate">{donation.donor_name}</div>
                      <div className="text-[11px] text-[#6b8a93] mt-px">
                        {format(new Date(donation.created_at), "yyyy/MM/dd")}
                      </div>
                    </div>
                    <div className="text-[13px] font-extrabold text-[#0b7c7b]">
                      {formatCurrency(donation.amount_minor, donation.currency_code, lang === "fa" ? "fa-IR" : "en-US")}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-[#6b8a93] text-xs bg-[#f7fbfb] rounded-lg border border-dashed border-[#dce6e8]">
                {t.noDonations}
              </div>
            )}
          </div>

          {/* Urgency Banner */}
          <div className="bg-gradient-to-br from-[#fff8f0] to-[#fff0f0] border border-[#ffdddd] rounded-[14px] p-4 flex items-center gap-3 animate-[fadeUp_0.5s_0.25s_ease_both]">
             <AlertTriangle className="w-7 h-7 text-[#c53030] shrink-0" />
             <div className="flex-1">
               <h4 className="text-[13px] font-extrabold text-[#c53030] mb-0.5">
                 {lang === "fa" ? "وضعیت اضطراری" : "Urgent Case"}
               </h4>
               <p className="text-xs text-[#9b4444] leading-relaxed">
                 {lang === "fa" ? "این کیس نیاز به کمک فوری دارد. لطفاً همین حالا حمایت کنید." : "This case needs immediate help. Please donate now."}
               </p>
             </div>
          </div>

          {/* Share Card */}
          <div className="bg-gradient-to-br from-[#e0f7f7] to-white border border-[rgba(14,165,164,0.2)] rounded-[20px] p-5 text-center animate-[fadeUp_0.5s_0.35s_ease_both]">
            <p className="text-[13px] text-[#3d5a63] leading-relaxed mb-3.5">
              {lang === "fa" 
                ? "با اشتراک‌گذاری این صفحه، شانس نجات این فرشته را بیشتر کنید." 
                : "Share this page to increase the chance of saving this angel."}
            </p>
            <div className="flex gap-2 justify-center">
              <button onClick={handleShare} className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-[10px] border-[1.5px] border-[#dce6e8] bg-white text-[12px] font-bold text-[#3d5a63] cursor-pointer transition-all hover:border-[#0ea5a4] hover:text-[#0ea5a4] hover:bg-[#e0f7f7]">
                <Share2 className="w-3.5 h-3.5" />
                {t.share}
              </button>
            </div>
          </div>

        </div>

      </div>

      {details.media && details.media.length > 0 && (
        <Lightbox
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          initialIndex={lightboxIndex}
          images={details.media.map(m => ({
            src: getImageUrl(m.url),
            alt: m.caption || details.title
          }))}
        />
      )}
    </div>
  );
}
