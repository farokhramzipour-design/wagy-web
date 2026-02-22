"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  phoneVerified: boolean;
}

export function VerificationStatus({ status, phoneVerified }: VerificationStatusProps) {
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
      completed: phoneVerified,
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
        (status.documents.national_card_front.status === "approved" || status.documents.national_card_front.status === "verified") &&
        (status.documents.national_card_back.status === "approved" || status.documents.national_card_back.status === "verified"),
      pending:
        status.documents.national_card_front.status === "pending" &&
        status.documents.national_card_back.status === "pending",
      rejected:
        status.documents.national_card_front.status === "rejected" ||
        status.documents.national_card_back.status === "rejected",
      expired:
        status.documents.national_card_front.status === "expired" ||
        status.documents.national_card_back.status === "expired",
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
  ], [status, t, phoneVerified]);

  // Find the first step that is not completed and not pending (i.e., the next actionable step)
  const currentStep = steps.find((s) => !s.completed && !s.pending);

  const showGlobalPending = steps.find(s => s.id === 1)?.pending && steps.find(s => s.id === 4)?.pending;

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

  const getStepStatus = (step: typeof steps[0]) => {
    if (step.completed) return "completed";
    if (step.pending) return "pending";
    if (step.rejected) return "rejected";
    if (step.expired) return "expired";
    return "default";
  };

  const completedSteps = steps.filter(s => s.completed).length;
  const totalSteps = steps.length;
  const progress = (completedSteps / totalSteps) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-10">
      <div className="text-center space-y-4 pt-4">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
          {t.title}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t.description}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-secondary/30 rounded-full h-3 overflow-hidden mb-8 sticky top-0 z-10 backdrop-blur-md">
        <div
          className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {showGlobalPending && (
        <Card className="border-yellow-200 bg-yellow-50/50 dark:bg-yellow-900/20 dark:border-yellow-800 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/40 rounded-full">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                {t.status.pendingMessage}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:gap-6">
        {steps.map((step, index) => {
          const status = getStepStatus(step);
          // A step is actionable if it's not completed AND not pending
          // BUT we also want to allow users to click into steps if they are rejected/expired to fix them.
          // And previously we allowed users to click any step if they are not pending.
          // The previous logic was: disabled={step.pending}

          const isActionable = !step.pending && !step.completed;

          // Check prerequisites based on user requirements
          let isDisabled = false;

          // Requirement: don't let users go throgh step 3 when they haven't completed step 2
          if (step.id === 3) {
            const step2 = steps.find(s => s.id === 2);
            if (!step2?.completed) isDisabled = true;
          }

          // Requirement: step 5 and 6 should remain disabled until steps 1 to 4 are completed and verified
          if (step.id === 5 || step.id === 6) {
            const step1 = steps.find(s => s.id === 1);
            const step2 = steps.find(s => s.id === 2);
            const step3 = steps.find(s => s.id === 3);
            const step4 = steps.find(s => s.id === 4);

            if (!step1?.completed || !step2?.completed || !step3?.completed || !step4?.completed) {
              isDisabled = true;
            }
          }

          // Requirement: step 6 couldn't be selectable if step 5 isn't completed
          if (step.id === 6) {
            const step5 = steps.find(s => s.id === 5);
            if (!step5?.completed) isDisabled = true;
          }

          return (
            <Card
              key={step.id}
              className={cn(
                "group transition-all duration-300 border-none ring-1 ring-slate-200 dark:ring-slate-800 hover:ring-2 hover:ring-primary/20",
                "shadow-sm hover:shadow-lg hover:-translate-y-0.5",
                status === "completed" && "bg-slate-50/50 dark:bg-slate-900/20 ring-green-100 dark:ring-green-900/30",
                status === "rejected" && "ring-red-200 bg-red-50/30 dark:bg-red-900/10 dark:ring-red-800",
                status === "expired" && "ring-orange-200 bg-orange-50/30 dark:bg-orange-900/10 dark:ring-orange-800",
                isDisabled && "opacity-50 cursor-not-allowed hover:shadow-none hover:translate-y-0 hover:ring-slate-200"
              )}
            >
              <CardContent className="p-5 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border",
                      status === "completed" ? "bg-green-100 text-green-700 border-green-200" : "bg-primary/10 text-primary border-primary/20",
                      isDisabled && "bg-slate-100 text-slate-400 border-slate-200"
                    )}>
                      {step.id}
                    </span>
                    <h3 className="font-bold text-lg md:text-xl text-foreground">
                      {step.title}
                    </h3>

                    {status === "completed" && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 gap-1.5 px-2.5 py-0.5">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {t.status.badges.completed}
                      </Badge>
                    )}
                    {status === "pending" && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200 gap-1.5 px-2.5 py-0.5">
                        <Clock className="h-3.5 w-3.5" />
                        {t.status.badges.pending}
                      </Badge>
                    )}
                    {status === "rejected" && (
                      <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200 gap-1.5 px-2.5 py-0.5">
                        <XCircle className="h-3.5 w-3.5" />
                        {t.status.badges.rejected}
                      </Badge>
                    )}
                    {status === "expired" && (
                      <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 hover:bg-orange-100 gap-1.5 px-2.5 py-0.5">
                        <Clock className="h-3.5 w-3.5" />
                        {t.status.badges.expired}
                      </Badge>
                    )}
                  </div>

                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed pl-11">
                    {step.description}
                  </p>

                  {status === "rejected" && step.rejectionReason && (
                    <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800/50 text-sm text-red-600 dark:text-red-400 pl-11">
                      <span className="font-semibold block mb-1">{t.status.rejectionReason}</span>
                      {step.rejectionReason}
                    </div>
                  )}
                </div>

                {status !== "completed" && status !== "pending" && (
                  <div className="pl-11 sm:pl-0 pt-2 sm:pt-0">
                    <Button
                      onClick={() => handleStartStep(step.id)}
                      disabled={isDisabled}
                      size="lg"
                      className={cn(
                        "w-full sm:w-auto min-w-[140px] rounded-xl font-medium shadow-sm transition-all active:scale-95",
                        status === "rejected" || status === "expired"
                          ? "bg-orange-500 hover:bg-orange-600 text-white"
                          : "bg-primary hover:bg-primary/90"
                      )}
                    >
                      {status === "rejected" || status === "expired" ? t.status.actions.resubmit : t.status.actions.start}
                      <ArrowRight className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0 rtl:rotate-180" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
