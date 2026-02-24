"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE_URL } from "@/lib/api-client";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { adminCharityApi } from "@/services/admin-charity-api";
import { Media, uploadMedia } from "@/services/media-api";
import { CreateCharityCaseUpdate } from "@/types/charity";
import { Loader2, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

const content = { en, fa };

interface CharityUpdateFormProps {
  charityCaseId: number;
  accessToken?: string;
}

export function CharityUpdateForm({ charityCaseId, accessToken }: CharityUpdateFormProps) {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = (content[lang] as any).dashboard.charity.form;

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CreateCharityCaseUpdate>({
    title: "",
    body: "",
    spent_amount_minor: 0,
    currency_code: "IRR",
    media_ids: [],
  });

  const [galleryImages, setGalleryImages] = useState<Media[]>([]);

  // Helper for image URLs
  const getImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !accessToken) return;

    try {
      setUploading(true);
      const files = Array.from(e.target.files);

      // Upload in parallel
      const uploadPromises = files.map(file => uploadMedia(accessToken, file, "other"));
      const uploadedMedia = await Promise.all(uploadPromises);

      setGalleryImages(prev => [...prev, ...uploadedMedia]);
      setFormData(prev => {
        const newIds = uploadedMedia.map(m => m.media_id);
        const allIds = [...(prev.media_ids || []), ...newIds];
        return {
          ...prev,
          media_ids: allIds,
        };
      });

      toast.success("Images uploaded");
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Failed to upload images");
    } finally {
      setUploading(false);
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    }
  };

  const removeGalleryImage = (mediaId: number) => {
    setGalleryImages(prev => prev.filter(m => m.media_id !== mediaId));
    setFormData(prev => {
      const newIds = (prev.media_ids || []).filter(id => id !== mediaId);
      return {
        ...prev,
        media_ids: newIds,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await adminCharityApi.addUpdate(charityCaseId, formData);
      toast.success(t.updateSuccess);
      router.push("/app/charity");
      router.refresh();
    } catch (error) {
      console.error("Submit failed", error);
      toast.error(t.updateError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t.titleLabel}</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder={t.enterUpdateTitle}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="spent_amount">{t.spentAmount}</Label>
            <Input
              id="spent_amount"
              type="number"
              value={formData.spent_amount_minor}
              onChange={(e) => setFormData({ ...formData, spent_amount_minor: Number(e.target.value) })}
              min="0"
            />
          </div>
        </div>

        <div className="space-y-4">
          {/* Gallery Upload */}
          <div className="space-y-2">
            <Label>{t.galleryLabel}</Label>
            <div className="grid grid-cols-3 gap-4">
              {galleryImages.map((image) => (
                <div key={image.media_id} className="relative aspect-square rounded-lg overflow-hidden border border-neutral-200 group">
                  <img
                    src={getImageUrl(image.thumb_url || image.url)}
                    alt="Gallery"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(image.media_id)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              <div
                onClick={() => galleryInputRef.current?.click()}
                className="aspect-square rounded-lg border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center cursor-pointer hover:border-[#0ea5a4] hover:bg-[#0ea5a4]/5 transition-colors"
              >
                {uploading ? (
                  <Loader2 className="w-6 h-6 text-neutral-400 animate-spin" />
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-neutral-400 mb-2" />
                    <span className="text-xs text-neutral-500">{t.upload}</span>
                  </>
                )}
              </div>
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleGalleryUpload}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">{t.updateBody}</Label>
        <Textarea
          id="body"
          value={formData.body}
          onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          required
          placeholder={t.describeUpdate}
          className="min-h-[150px]"
        />
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-neutral-100">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          {t.cancel}
        </Button>
        <Button
          type="submit"
          className="bg-[#0ea5a4] hover:bg-[#0b7c7b]"
          disabled={loading}
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {t.submitUpdate}
        </Button>
      </div>
    </form>
  );
}
