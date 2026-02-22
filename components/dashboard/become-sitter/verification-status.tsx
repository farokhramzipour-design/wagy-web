"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { VerificationStatusResponse } from "@/services/verification-api";
import { ArrowRight, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

const content = { en, fa };

interface VerificationStatusProps {
  status: VerificationStatusResponse;
  phone: string | null;
}

export function VerificationStatus({ status, phone }: VerificationStatusProps) {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = content[lang].becomeSitter;

  const steps = useMemo(() => [
    {
      id: 1,
      title: t.steps.address.title,
      description: t.steps.address.description,
      completed: status.postal_code?.added && status.provider_address?.status === "approved",
      pending: status.provider_address?.status === "pending",
      rejected: status.provider_address?.status === "rejected",
      expired: status.provider_address?.status === "expired",
      rejectionReason: status.provider_address?.rejection_reason,
      status: status.provider_address?.status,
    },
    {
      id: 2,
      title: t.steps.phone.title,
      description: t.steps.phone.description,
      completed: !!phone,
      pending: false,
    },
    {
      id: 3,
      title: t.steps.identity.title,
      description: t.steps.identity.description,
      completed: status.national_code?.added && status.shahkar?.verified,
      pending: false,
    },
    {
      id: 4,
      title: t.steps.documents.title,
      description: t.steps.documents.description,
      completed:
        status.documents.national_card_front.status === "approved" &&
        status.documents.national_card_back.status === "approved" &&
        status.documents.birth_certificate.status === "approved",
      pending:
        status.documents.national_card_front.status === "pending" ||
        status.documents.national_card_back.status === "pending" ||
        status.documents.birth_certificate.status === "pending",
      rejected:
        status.documents.national_card_front.status === "rejected" ||
        status.documents.national_card_back.status === "rejected" ||
        status.documents.birth_certificate.status === "rejected",
      expired:
        status.documents.national_card_front.status === "expired" ||
        status.documents.national_card_back.status === "expired" ||
        status.documents.birth_certificate.status === "expired",
    },
    {
      id: 5,
      title: t.steps.services.title,
      description: t.steps.services.description,
      completed: false,
      pending: false,
    },
    {
      id: 6,
      title: t.steps.details.title,
      description: t.steps.details.description,
      completed: false,
      pending: false,
    },
  ], [status, t, phone]);

  // Find the first step that is not completed and not pending (i.e., the next actionable step)
  const currentStep = steps.find((s) => !s.completed && !s.pending);

  const isManualReviewPending = (steps.find(s => s.id === 1)?.pending || steps.find(s => s.id === 4)?.pending);
  const isAutomatedStepsCompleted = (steps.find(s => s.id === 2)?.completed && steps.find(s => s.id === 3)?.completed);

  const showGlobalPending = isManualReviewPending && isAutomatedStepsCompleted;

  const handleStartStep = (stepId: number) => {
    switch (stepId) {
      case 1:
        router.push("/app/become-sitter/address");
        break;
      case 2:
        router.push("/app/become-sitter/phone");
        break;
      case 3:
        router.push("/app/become-sitter/identity");
        break;
      case 4:
        router.push("/app/become-sitter/documents");
        break;
      case 5:
        router.push("/app/become-sitter/services");
        break;
      case 6:
        router.push("/app/become-sitter/details");
        break;
    }
  };

  const getStatusBadge = (step: typeof steps[0]) => {
    if (step.completed) {
      return <Badge variant="default" className="bg-green-500 hover:bg-green-600">{t.status.badges.completed}</Badge>;
    }
    if (step.rejected) {
      return <Badge variant="destructive">{t.status.badges.rejected}</Badge>;
    }
    if (step.expired) {
      return <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600">{t.status.badges.expired}</Badge>;
    }
    if (step.pending) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">{t.status.badges.pending}</Badge>;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">{t.title}</h2>
        <p className="text-muted-foreground">
          {t.description}
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t.status.title}</CardTitle>
              <CardDescription className="mt-2">
                {currentStep ? `${t.status.currentStep} ${currentStep.title}` : t.status.checking}
              </CardDescription>
            </div>
            {currentStep && (
              <Button onClick={() => handleStartStep(currentStep.id)}>
                {currentStep.rejected || currentStep.expired ? t.status.actions.retry : t.status.continue}
                <ArrowRight className="mr-2 w-4 h-4 rtl:rotate-180" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {showGlobalPending && (
            <div className="mb-6 p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200 flex items-center gap-3">
              <Clock className="w-5 h-5" />
              <p>{t.status.pendingMessage}</p>
            </div>
          )}

          <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent rtl:before:mr-5 rtl:before:ml-0">
            {steps.map((step, index) => {
              // A step is considered "current" if it's the first incomplete step, just for visual highlighting
              const isCurrent = currentStep?.id === step.id;

              return (
                <div key={step.id} className="relative flex gap-6 pb-8 last:pb-0 items-start">
                  <div className={cn(
                    "absolute left-0 mt-1 flex h-10 w-10 items-center justify-center rounded-full border bg-background rtl:right-0",
                    step.completed ? "border-primary text-primary" :
                      step.rejected || step.expired ? "border-destructive text-destructive" :
                        isCurrent ? "border-primary text-foreground" : "border-muted-foreground text-muted-foreground"
                  )}>
                    {step.completed ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : step.rejected || step.expired ? (
                      <XCircle className="h-6 w-6" />
                    ) : (
                      <span className="text-sm font-medium">{step.id}</span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-2 ltr:pl-16 rtl:pr-16">
                    <div className="flex items-center justify-between">
                      <h3 className={cn(
                        "font-semibold leading-none tracking-tight",
                        step.completed ? "text-primary" : "text-foreground"
                      )}>
                        {step.title}
                      </h3>
                      {getStatusBadge(step)}
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>

                    {(step.rejected || step.expired) && step.rejectionReason && (
                      <div className="mt-2 p-3 bg-red-50 text-red-800 rounded-md text-sm border border-red-100">
                        <span className="font-semibold">
                          {step.expired ? t.status.expirationReason : t.status.rejectionReason}
                        </span> {step.rejectionReason}
                      </div>
                    )}

                    {(step.rejected || step.expired) && (
                      <div className="mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleStartStep(step.id)}
                        >
                          {step.expired ? t.status.actions.retry : t.status.actions.resubmit}
                        </Button>
                      </div>
                    )}

                    {!step.completed && !step.pending && !step.rejected && !step.expired && (
                      <div className="mt-2">
                        <Button
                          variant={isCurrent ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleStartStep(step.id)}
                        >
                          {t.status.actions.start}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
