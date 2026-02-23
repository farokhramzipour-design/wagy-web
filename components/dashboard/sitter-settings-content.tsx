"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { SelectedServiceItem, SelectedServicesResponse } from "@/services/provider-api";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const content = { en, fa };

interface SitterSettingsContentProps {
  selectedServices: SelectedServicesResponse | null;
}

export function SitterSettingsContent({ selectedServices }: SitterSettingsContentProps) {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = (content[lang] as any).sitterSettings || {};

  const items = selectedServices?.items || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="w-3 h-3 mr-1" /> {t.approved}</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> {t.rejected}</Badge>;
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"><Clock className="w-3 h-3 mr-1" /> {t.pending}</Badge>;
      case "not_submitted":
      default:
        return <Badge variant="outline"><AlertCircle className="w-3 h-3 mr-1" /> {t.notSubmitted}</Badge>;
    }
  };

  const handleAction = (item: SelectedServiceItem) => {
    // Navigate to wizard page
    router.push(`/app/sitter-settings/${item.service_type_id}/wizard`);
  };

  const getActionButton = (item: SelectedServiceItem) => {
    // If not started, show "Start"
    if (!item.has_wizard_started) {
      return (
        <Button className="min-w-[100px]" size="sm" onClick={() => handleAction(item)}>
          {t.start}
          {lang === 'fa' ? <ArrowLeft className="w-4 h-4 mr-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      );
    }

    // If started but not complete, show "Complete"
    if (!item.is_wizard_complete) {
      return (
        <Button className="min-w-[100px]" variant="default" size="sm" onClick={() => handleAction(item)}>
          {t.complete}
          {lang === 'fa' ? <ArrowLeft className="w-4 h-4 mr-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      );
    }

    // If completed but not approved (and not rejected), show "Pending" or similar
    if (item.is_wizard_complete && !item.is_wizard_approved && item.wizard_approval_status !== 'rejected') {
      return (
        <Button className="min-w-[100px]" variant="secondary" disabled size="sm">
          {t.pending}
        </Button>
      );
    }

    // If rejected, maybe allow edit/resubmit? Using "Start" or "Complete" logic might be better but for now let's just show status or "Edit"
    if (item.wizard_approval_status === 'rejected') {
      return (
        <Button className="min-w-[100px]" variant="outline" size="sm" onClick={() => handleAction(item)}>
          {t.complete} {/* Assuming they need to fix things */}
        </Button>
      );
    }

    // If approved
    if (item.is_wizard_approved) {
      return (
        <Button className="min-w-[100px]" variant="outline" size="sm" onClick={() => handleAction(item)}>
          {t.edit}
        </Button>
      );
    }

    return null;
  };

  return (
    <div className="container py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t.title}</h1>
        <Button variant="outline" onClick={() => router.push('/app/sitter-settings/services')}>
          {t.selectServicesBtn}
        </Button>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No services selected.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const progress = item.provider_service && item.provider_service.total_steps > 0
              ? (item.provider_service.completed_steps / item.provider_service.total_steps) * 100
              : 0;

            return (
              <Card key={item.selected_service_id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 md:p-6 gap-4">
                  {/* Service Info */}
                  <div className="flex-1 space-y-1">
                    <h3 className="text-lg font-semibold">
                      {lang === "fa" ? item.name_fa : item.name_en}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{t.approvalStatus}:</span>
                      {getStatusBadge(item.wizard_approval_status)}
                    </div>
                    {item.wizard_rejection_reason && (
                      <p className="text-sm text-red-600 mt-1">
                        {t.rejectionReason}: {item.wizard_rejection_reason}
                      </p>
                    )}
                  </div>

                  {/* Progress Bar (Only if started and not complete) */}
                  {item.has_wizard_started && !item.is_wizard_complete && (
                    <div className="w-full md:w-1/3 space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="flex-shrink-0">
                    {getActionButton(item)}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
