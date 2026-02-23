"use client";

import { ServiceWizard } from "@/components/dashboard/become-sitter/wizard/service-wizard";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { startServiceWizard } from "@/services/provider-api";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const content = { en, fa };

interface WizardClientProps {
  serviceId: number; // This is actually the service_type_id
}

export function WizardClient({ serviceId }: WizardClientProps) {
  const router = useRouter();
  const { lang } = useLanguage();
  const commonT = (content[lang] as any).common || { back: "Back" };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [providerServiceId, setProviderServiceId] = useState<number | null>(null);

  useEffect(() => {
    const initWizard = async () => {
      if (!serviceId) return;

      try {
        setLoading(true);
        // Start wizard directly with the service_type_id
        const wizard = await startServiceWizard({ service_type_id: serviceId });
        setProviderServiceId(wizard.provider_service_id);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to start wizard");
      } finally {
        setLoading(false);
      }
    };

    initWizard();
  }, [serviceId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-md mx-auto mt-8 border-red-200 bg-red-50 dark:bg-red-900/10">
        <CardContent className="pt-6 text-center text-red-600 dark:text-red-400">
          <p>{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="mt-4 border-red-200 hover:bg-red-100">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!providerServiceId) return null;

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <div className="mb-4">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          {lang === 'fa' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          {commonT.back || "Back"}
        </Button>
      </div>

      <ServiceWizard
        providerServiceId={providerServiceId}
        onComplete={() => router.push("/app/sitter-settings")}
      />
    </div>
  );
}
