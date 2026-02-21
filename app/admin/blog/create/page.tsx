
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/language-provider";
import { adminBlogApi } from "@/services/admin-blog-api";
import { PostForm } from "@/components/admin/blog/post-form";
import { BlogCategory } from "@/types/admin-blog";
import { Loader2, Plus } from "lucide-react";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";

const content = { en, fa };

export default function CreatePostPage() {
  const { lang } = useLanguage();
  const t = (content[lang] as any).admin.blog;
  
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<BlogCategory[]>([]);

  useEffect(() => {
    adminBlogApi.getCategories().then(setCategories).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Plus className="w-6 h-6 text-[#0ea5a4]" />
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">{t.createTitle}</h1>
          <p className="text-neutral-500">{t.createDesc}</p>
        </div>
      </div>
      
      <PostForm categories={categories} />
    </div>
  );
}
