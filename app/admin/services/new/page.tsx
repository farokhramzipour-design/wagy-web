"use client";

import { createServiceTypeAction, uploadMediaAction } from "@/app/admin/services/actions";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { ChevronLeft, ChevronRight, Loader2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const content = { en, fa };

export default function CreateServicePage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = (content[lang] as any).admin.services;
  const isRtl = lang === "fa";

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name_en: "",
    name_fa: "",
    description: "",
    icon_media_id: 0,
    display_order: 0,
    color: "",
    is_active: true,
  });
  const [iconPreview, setIconPreview] = useState<string>("");

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("media_type", "other");

    try {
      const response = await uploadMediaAction(uploadFormData);
      setFormData((prev) => ({ ...prev, icon_media_id: response.media_id }));
      setIconPreview(response.url);
      toast.success(t.form.uploadSuccess || "Image uploaded successfully");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(t.form.uploadError || "Failed to upload image");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name_en || !formData.name_fa) {
      toast.error(t.form.error || "Please fill required fields");
      return;
    }

    setLoading(true);
    try {
      await createServiceTypeAction(formData);
      toast.success(t.form.success);
      router.push("/admin/services");
      router.refresh();
    } catch (error) {
      console.error("Failed to create service:", error);
      toast.error(t.form.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          {isRtl ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.createTitle}</h1>
          <p className="text-muted-foreground">{t.createDesc}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.createTitle}</CardTitle>
          <CardDescription>{t.createDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name_en">{t.nameEn} *</Label>
                <Input
                  id="name_en"
                  placeholder={t.form.nameEnPlaceholder}
                  value={formData.name_en}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name_en: e.target.value }))}
                  required
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name_fa">{t.nameFa} *</Label>
                <Input
                  id="name_fa"
                  placeholder={t.form.nameFaPlaceholder}
                  value={formData.name_fa}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name_fa: e.target.value }))}
                  required
                  dir="rtl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t.description}</Label>
              <Textarea
                id="description"
                placeholder={t.form.descPlaceholder}
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t.icon}</Label>
                <div className="flex flex-col gap-4">
                  {iconPreview ? (
                    <div className="relative w-32 h-32 rounded-lg border overflow-hidden group">
                      <img src={iconPreview} alt="Icon preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, icon_media_id: 0 }));
                            setIconPreview("");
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-32 border-dashed flex flex-col gap-2"
                        onClick={() => document.getElementById('icon-upload')?.click()}
                      >
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Upload Icon</span>
                      </Button>
                      <input
                        id="icon-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleIconUpload}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">{t.color}</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    className="w-12 p-1 h-10"
                    value={formData.color || "#000000"}
                    onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
                  />
                  <Input
                    placeholder={t.form.colorPlaceholder}
                    value={formData.color}
                    onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="display_order">{t.order}</Label>
                <Input
                  id="display_order"
                  type="number"
                  placeholder={t.form.orderPlaceholder}
                  value={formData.display_order}
                  onChange={(e) => setFormData((prev) => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="is_active">{t.status}</Label>
                <Select
                  value={formData.is_active ? "true" : "false"}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, is_active: val === "true" }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">{t.active}</SelectItem>
                    <SelectItem value="false">{t.inactive}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                {t.form.cancel}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? t.form.saving : t.form.save}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
