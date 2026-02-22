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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{t.title}</h1>
        <p className="text-muted-foreground">{t.description}</p>
      </div>

      {showGlobalPending && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <p className="text-yellow-800 dark:text-yellow-200">
                {t.status.pendingMessage}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
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
                "transition-colors",
                status === "completed" && "bg-muted/50",
                status === "rejected" && "border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800",
                status === "expired" && "border-orange-200 bg-orange-50 dark:bg-orange-900/10 dark:border-orange-800",
                isDisabled && "opacity-60 cursor-not-allowed"
              )}
            >
              <CardContent className="p-6 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      {step.id}. {step.title}
                      {status === "completed" && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                      {status === "pending" && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400">
                          Pending Review
                        </Badge>
                      )}
                      {status === "rejected" && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          Rejected
                        </Badge>
                      )}
                      {status === "expired" && (
                        <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400">
                          Expired
                        </Badge>
                      )}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                  {status === "rejected" && step.rejectionReason && (
                    <p className="text-sm text-red-600 mt-2 font-medium">
                      Reason: {step.rejectionReason}
                    </p>
                  )}
                </div>

                {status !== "completed" && status !== "pending" && (
                  <Button
                    onClick={() => handleStartStep(step.id)}
                    disabled={isDisabled}
                  >
                    {status === "rejected" || status === "expired" ? "Fix Issue" : "Start"}
                    <ArrowRight className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0 rtl:rotate-180" />
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
