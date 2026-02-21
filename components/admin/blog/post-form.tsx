"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/language-provider";
import { adminBlogApi } from "@/services/admin-blog-api";
import { adminApi } from "@/services/admin-api";
import { BlogPost, BlogCategory } from "@/types/admin-blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Save, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { cn } from "@/lib/utils";

const content = { en, fa };

interface PostFormProps {
  initialData?: BlogPost;
  categories: BlogCategory[];
}

export function PostForm({ initialData, categories }: PostFormProps) {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = (content[lang] as any).admin.blog.form;
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title_en: initialData?.title_en || "",
    title_fa: initialData?.title_fa || "",
    slug: initialData?.slug || "",
    excerpt_en: initialData?.excerpt_en || "",
    excerpt_fa: initialData?.excerpt_fa || "",
    content_en: initialData?.content_en || "",
    content_fa: initialData?.content_fa || "",
    cover_media_id: initialData?.cover_media_id || 0,
    status: initialData?.status || "draft",
    category_id: initialData?.category_id || (categories[0]?.category_id || 0),
    tags: initialData?.tags?.join(", ") || "",
  });
  
  // For display only
  const [coverUrl, setCoverUrl] = useState(initialData?.cover_url || "");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    try {
      setUploading(true);
      const file = e.target.files[0];
      const res = await adminApi.uploadMedia(file, "blog_cover");
      setFormData(prev => ({ ...prev, cover_media_id: res.media_id }));
      setCoverUrl(res.url);
      toast.success(t.uploadSuccess || "Image uploaded");
    } catch (error) {
      console.error("Upload failed", error);
      toast.error(t.uploadError || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(",").map(s => s.trim()).filter(Boolean),
        category_id: Number(formData.category_id)
      };

      if (initialData) {
        await adminBlogApi.updatePost(initialData.post_id, payload);
      } else {
        await adminBlogApi.createPost(payload);
      }
      
      toast.success(t.success);
      router.push("/admin/blog");
      router.refresh();
    } catch (error) {
      console.error("Save failed", error);
      toast.error(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t.titleEn}</Label>
            <Input 
              value={formData.title_en} 
              onChange={e => setFormData({...formData, title_en: e.target.value})}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>{t.titleFa}</Label>
            <Input 
              value={formData.title_fa} 
              onChange={e => setFormData({...formData, title_fa: e.target.value})}
              required
              dir="rtl"
            />
          </div>
          <div className="space-y-2">
            <Label>{t.slug}</Label>
            <Input 
              value={formData.slug} 
              onChange={e => setFormData({...formData, slug: e.target.value})}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>{t.category}</Label>
            <Select 
              value={formData.category_id.toString()} 
              onValueChange={v => setFormData({...formData, category_id: Number(v)})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(c => (
                  <SelectItem key={c.category_id} value={c.category_id.toString()}>
                    {lang === "fa" ? c.name_fa : c.name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
           <div className="space-y-2">
            <Label>{t.status}</Label>
            <Select 
              value={formData.status} 
              onValueChange={v => setFormData({...formData, status: v as any})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Media & Meta */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t.coverImage}</Label>
            <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center min-h-[200px] relative bg-neutral-50">
              {coverUrl ? (
                <img src={coverUrl} alt="Cover" className="w-full h-48 object-cover rounded-md" />
              ) : (
                <div className="text-center text-neutral-400">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                  <span className="text-sm">Upload Image</span>
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              )}
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={handleUpload}
                accept="image/*"
              />
            </div>
          </div>
           <div className="space-y-2">
            <Label>{t.tags}</Label>
            <Input 
              value={formData.tags} 
              onChange={e => setFormData({...formData, tags: e.target.value})}
              placeholder="tag1, tag2"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>{t.excerptEn}</Label>
          <Textarea 
            value={formData.excerpt_en} 
            onChange={e => setFormData({...formData, excerpt_en: e.target.value})}
            rows={3}
          />
        </div>
         <div className="space-y-2">
          <Label>{t.excerptFa}</Label>
          <Textarea 
            value={formData.excerpt_fa} 
            onChange={e => setFormData({...formData, excerpt_fa: e.target.value})}
            rows={3}
            dir="rtl"
          />
        </div>
        
        <div className="space-y-2">
          <Label>{t.contentEn}</Label>
          <Textarea 
            value={formData.content_en} 
            onChange={e => setFormData({...formData, content_en: e.target.value})}
            rows={10}
            className="font-mono text-sm"
          />
        </div>
         <div className="space-y-2">
          <Label>{t.contentFa}</Label>
          <Textarea 
            value={formData.content_fa} 
            onChange={e => setFormData({...formData, content_fa: e.target.value})}
            rows={10}
            className="font-mono text-sm"
            dir="rtl"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          {t.cancel}
        </Button>
        <Button type="submit" disabled={loading || uploading} className="bg-[#0ea5a4] hover:bg-[#0b7c7b]">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t.saving}
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {t.save}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
