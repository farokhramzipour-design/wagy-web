"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { ServiceType, updateSelectedServices } from "@/services/provider-api";
import { Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const content = { en, fa };

interface SelectServicesFormProps {
  serviceTypes: ServiceType[];
  initialSelectedServiceIds: number[];
}

export function SelectServicesForm({ serviceTypes, initialSelectedServiceIds }: SelectServicesFormProps) {
  const router = useRouter();
  const { lang } = useLanguage();
  // Fallback to becomeSitter.servicesStep if sitterSettings.selectServices is not defined yet
  const t = (content[lang] as any).sitterSettings?.selectServices || (content[lang] as any).becomeSitter.servicesStep;
  const commonT = (content[lang] as any).common || { back: "Back", save: "Save" };

  const [selectedServices, setSelectedServices] = useState<number[]>(initialSelectedServiceIds);
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
      await updateSelectedServices({
        service_type_ids: selectedServices
      });

      toast.success(t.success);
      router.push("/app/sitter-settings");
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
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
            {lang === 'fa' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {commonT.back || "Back"}
        </Button>
      </div>

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
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.saving}
              </>
            ) : (
              t.submitButton || "Save Changes"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
