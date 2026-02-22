"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { getSelectedServices, startServiceWizard } from "@/services/provider-api";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ServiceWizard } from "../wizard/service-wizard";

const content = { en, fa };

export function DetailsStep() {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = content[lang].becomeSitter;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [providerServiceId, setProviderServiceId] = useState<number | null>(null);

  useEffect(() => {
    const initWizard = async () => {
      try {
        setLoading(true);
        // 1. Get selected services
        const selectedServices = await getSelectedServices();
        const topServiceTypeId = selectedServices.top_service_type_id;

        if (!topServiceTypeId) {
          throw new Error("No service selected");
        }

        // 2. Start wizard
        const wizard = await startServiceWizard({ service_type_id: topServiceTypeId });
        setProviderServiceId(wizard.provider_service_id);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to start wizard");
      } finally {
        setLoading(false);
      }
    };

    initWizard();
  }, []);

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
    <div className="max-w-3xl mx-auto">
      <ServiceWizard providerServiceId={providerServiceId} />
    </div>
  );
}
