"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { ServiceType, updateSelectedServices } from "@/services/provider-api";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const content = { en, fa };

interface ServicesStepProps {
  serviceTypes: ServiceType[];
}

export function ServicesStep({ serviceTypes }: ServicesStepProps) {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = content[lang].becomeSitter.servicesStep;

  // TODO: Fetch current selection if applicable. For now we assume no services selected or handled elsewhere.
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = (id: number) => {
    setSelectedServices((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await updateSelectedServices({
        service_type_ids: selectedServices
      });

      toast.success(t.success);
      // Redirect to the next step or refresh
      router.push("/app/become-sitter");
      router.refresh();
    } catch (error: any) {
      console.error("Failed to update services:", error);
      toast.error(error.message || t.error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!serviceTypes || serviceTypes.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            {t.noServices}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {serviceTypes.map((service) => (
              <div
                key={service.service_type_id}
                className="flex items-center justify-between p-4 border rounded-lg transition-colors hover:bg-muted/50"
              >
                <div className="space-y-1">
                  <Label
                    htmlFor={`service-${service.service_type_id}`}
                    className="text-base font-medium cursor-pointer"
                  >
                    {lang === "fa" ? service.name_fa : service.name_en}
                  </Label>
                  {service.description && (
                    <p className="text-sm text-muted-foreground">
                      {service.description}
                    </p>
                  )}
                </div>
                <Switch
                  id={`service-${service.service_type_id}`}
                  checked={selectedServices.includes(service.service_type_id)}
                  onCheckedChange={() => handleToggle(service.service_type_id)}
                />
              </div>
            ))}
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={isLoading || selectedServices.length === 0}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.saving}
              </>
            ) : (
              t.submitButton
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
