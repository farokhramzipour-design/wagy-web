"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { CharityCaseForm } from "@/components/admin/charity/charity-case-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { adminCharityApi } from "@/services/admin-charity-api";
import { CharityCaseDetail } from "@/types/charity";
import { toast } from "sonner";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";

const content = { en, fa };

export default function EditCharityCasePage() {
  const { lang } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const t = (content[lang] as any).dashboard.charity;

  const [loading, setLoading] = useState(true);
  const [caseDetail, setCaseDetail] = useState<CharityCaseDetail | undefined>(undefined);

  useEffect(() => {
    if (!id) return;
    fetchCase();
  }, [id]);

  const fetchCase = async () => {
    try {
      setLoading(true);
      const data = await adminCharityApi.getCaseById(id);
      setCaseDetail(data);
    } catch (error) {
      console.error("Failed to fetch case", error);
      toast.error("Failed to fetch case details");
      router.push("/app/charity");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!caseDetail) {
    return null; // Will redirect in catch block
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Link href="/app/charity">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500" />
            {t.editTitle}
          </h1>
          <p className="text-neutral-500">{t.editDesc}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-neutral-200">
        <CharityCaseForm initialData={caseDetail} />
      </div>
    </div>
  );
}
