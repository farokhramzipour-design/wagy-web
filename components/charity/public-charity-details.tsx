"use client";

import { calculateProgress, formatCurrency, getDaysLeft, getImageUrl } from "@/components/charity/charity-utils";
import { DonationDialog } from "@/components/charity/donation-dialog";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { charityPublicApi } from "@/services/charity-public-api";
import { CharityCaseDetails, CharityDonation } from "@/types/charity-public";
import { format } from "date-fns-jalali";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, Heart, Share2, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
      setLoading(false); // Only stop loading after details are fetched
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-bold text-neutral-800">Case not found</h1>
        <Link href="/charity">
          <Button variant="link" className="text-rose-600 mt-4">
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

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Header Image */}
      <div className="relative h-[400px] w-full bg-neutral-900">
        {details.cover_image_url && (
          <Image
            src={getImageUrl(details.cover_image_url)}
            alt={details.title}
            fill
            className="object-cover opacity-60"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-10">
          <Link href="/charity" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
            {lang === "fa" ? <ArrowRight className="ml-2 w-5 h-5" /> : <ArrowLeft className="mr-2 w-5 h-5" />}
            {common.back}
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-4 max-w-3xl">
              {/* <Badge variant="secondary" className="bg-rose-500 text-white border-0 px-3 py-1 text-sm font-medium">
                {details.status === "active" ? `${daysLeft} ${t.daysLeft}` : details.status}
              </Badge> */}
              <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                {details.title}
              </h1>
              <div className="flex items-center gap-6 text-white/90 text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>{details.creator.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5" />
                  <span>{format(new Date(details.created_at), "yyyy/MM/dd")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{daysLeft} {t.daysLeft}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm"
                onClick={handleShare}
              >
                <Share2 className="w-5 h-5 mr-2" />
                {t.share}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        {/* Main Content */}
        <div className="space-y-8">
          {/* Story */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <h2 className="text-2xl font-bold text-neutral-800 flex items-center gap-3">
                <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                {t.story}
              </h2>
              <div className="prose prose-neutral max-w-none text-neutral-600 leading-relaxed whitespace-pre-wrap">
                {details.description}
              </div>

              {/* Media Gallery */}
              {details.media && details.media.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                  {details.media.map((media) => (
                    <div key={media.media_id} className="relative aspect-square rounded-xl overflow-hidden group">
                      <Image
                        src={getImageUrl(media.thumbnail_url || media.url)}
                        alt={media.caption || "Charity media"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Updates */}
          {details.updates && details.updates.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-neutral-800 px-2">{t.updates}</h3>
              {details.updates.map((update) => (
                <Card key={update.charity_update_id} className="border-0 shadow-md overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-rose-100 rounded-full p-3 text-rose-600 shrink-0">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div className="space-y-2 flex-grow">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-lg text-neutral-800">{update.title}</h4>
                          <span className="text-sm text-neutral-500">
                            {format(new Date(update.created_at), "yyyy/MM/dd")}
                          </span>
                        </div>
                        <p className="text-neutral-600">{update.body}</p>
                        {update.media && update.media.length > 0 && (
                          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                            {update.media.map((m) => (
                              <div key={m.media_id} className="relative w-32 h-24 rounded-lg overflow-hidden shrink-0">
                                <Image src={getImageUrl(m.thumbnail_url || m.url)} alt={m.caption} fill className="object-cover" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Donation Card */}
          <Card className="border-0 shadow-xl sticky top-24 overflow-hidden">
            <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-6 text-white text-center">
              <p className="text-lg font-medium opacity-90 mb-1">{t.target}</p>
              <p className="text-3xl font-bold">
                {formatCurrency(details.target_amount_minor, details.currency_code, lang === "fa" ? "fa-IR" : "en-US")}
              </p>
            </div>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-neutral-600">{t.collected}</span>
                  <span className="text-rose-600">{progress}%</span>
                </div>
                <Progress value={progress} className="h-3 bg-neutral-100 [&>div]:bg-rose-500" />
                <div className="flex justify-between text-xs text-neutral-500 pt-1">
                  <span>{formatCurrency(details.collected_amount_minor, details.currency_code, lang === "fa" ? "fa-IR" : "en-US")}</span>
                  <span>{t.donors}: {details.donors_count}</span>
                </div>
              </div>

              <DonationDialog
                caseId={details.charity_case_id}
                caseTitle={details.title}
                currency={details.currency_code}
                isLoggedIn={isLoggedIn}
              />

              <div className="pt-6 border-t border-neutral-100">
                <h4 className="font-bold text-neutral-800 mb-4 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500" />
                  {t.recentDonations}
                </h4>
                {donations.length > 0 ? (
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {donations.map((donation) => (
                      <div key={donation.donation_id} className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                        <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-sm">
                          {donation.donor_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-neutral-800 text-sm">{donation.donor_name}</p>
                          <p className="text-xs text-neutral-500">{format(new Date(donation.created_at), "yyyy/MM/dd HH:mm")}</p>
                        </div>
                        <div className="ml-auto font-bold text-emerald-600 text-sm">
                          {formatCurrency(donation.amount_minor, donation.currency_code, lang === "fa" ? "fa-IR" : "en-US")}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-neutral-400 text-sm bg-neutral-50 rounded-lg border border-dashed border-neutral-200">
                    {t.noDonations}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
