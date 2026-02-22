"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getVerificationStatus, VerificationStatusResponse } from "@/services/verification-api";
import { AlertCircle, ArrowRight, CheckCircle2, Clock, Loader2, RotateCcw, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface VerificationStatusProps {
  phone: string | null;
}

export function VerificationStatus({ phone }: VerificationStatusProps) {
  const router = useRouter();
  const [status, setStatus] = useState<VerificationStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await getVerificationStatus();
        setStatus(data);
      } catch (err) {
        console.error("Failed to fetch verification status", err);
        setError("Failed to load verification status.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full border-red-200 bg-red-50">
        <CardContent className="flex flex-col items-center justify-center py-8 text-red-600 gap-2">
          <AlertCircle className="w-8 h-8" />
          <p>{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()} className="mt-2 border-red-200 hover:bg-red-100 text-red-700">
            تلاش مجدد
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Determine Step 1 Status
  const step1Status = status?.provider_address?.status || null;
  const step1Completed = step1Status === "approved";
  const step1Pending = step1Status === "pending";
  const step1Rejected = step1Status === "rejected";
  const step1Expired = step1Status === "expired";

  // Determine Step 2 Status (Phone)
  const step2Completed = !!phone;

  // Determine Step 3 Status (National Code)
  const step3Completed = !!(status?.national_code?.added && status?.shahkar?.verified);

  // Determine Step 4 Status (Documents)
  const docFrontStatus = status?.documents?.national_card_front?.status;
  const docBackStatus = status?.documents?.national_card_back?.status;
  const docBirthStatus = status?.documents?.birth_certificate?.status;

  const step4Completed =
    docFrontStatus === "approved" &&
    docBackStatus === "approved" &&
    docBirthStatus === "approved";

  const step4Pending =
    (docFrontStatus === "pending" || docBackStatus === "pending" || docBirthStatus === "pending") &&
    !step4Completed;

  const step4Rejected =
    docFrontStatus === "rejected" ||
    docBackStatus === "rejected" ||
    docBirthStatus === "rejected";

  const step4Expired =
    docFrontStatus === "expired" ||
    docBackStatus === "expired" ||
    docBirthStatus === "expired";

  // Determine current active step logic
  let currentStepId = 1;
  if (step1Completed) currentStepId = 2;
  if (step1Completed && step2Completed) currentStepId = 3;
  if (step1Completed && step2Completed && step3Completed) currentStepId = 4;
  if (step1Completed && step2Completed && step3Completed && step4Completed) currentStepId = 5;

  // If a step is rejected or expired, user should be directed back to it to fix/re-upload
  if (step1Rejected || step1Expired) currentStepId = 1;
  // If step 4 is rejected/expired but previous steps are done, go to step 4
  if (step1Completed && step2Completed && step3Completed && (step4Rejected || step4Expired)) currentStepId = 4;

  const steps = [
    {
      id: 1,
      title: "آدرس و موقعیت مکانی",
      description: "ثبت آدرس دقیق و موقعیت مکانی جهت نمایش به کاربران",
      status: step1Status,
      completed: step1Completed,
      pending: step1Pending,
      rejected: step1Rejected,
      expired: step1Expired,
      current: currentStepId === 1,
      rejectionReason: status?.provider_address?.rejection_reason,
    },
    {
      id: 2,
      title: "تأیید شماره موبایل",
      description: "شماره موبایل جهت ارتباط با کاربران و دریافت اعلانات",
      completed: step2Completed,
      current: currentStepId === 2,
    },
    {
      id: 3,
      title: "احراز هویت (کد ملی)",
      description: "تأیید هویت از طریق سامانه شاهکار",
      completed: step3Completed,
      current: currentStepId === 3,
    },
    {
      id: 4,
      title: "بارگذاری مدارک",
      description: "تصویر کارت ملی و شناسنامه",
      completed: step4Completed,
      pending: step4Pending,
      rejected: step4Rejected,
      expired: step4Expired,
      current: currentStepId === 4,
      // Aggregate rejection reasons if any
      rejectionReason: [
        status?.documents?.national_card_front?.rejection_reason,
        status?.documents?.national_card_back?.rejection_reason,
        status?.documents?.birth_certificate?.rejection_reason
      ].filter(Boolean).join(" | "),
    },
    {
      id: 5,
      title: "انتخاب خدمات",
      description: "انتخاب خدماتی که مایل به ارائه آن‌ها هستید",
      completed: false, // TODO
      current: currentStepId === 5,
    },
    {
      id: 6,
      title: "تکمیل اطلاعات خدمات",
      description: "تعیین قیمت و شرایط برای هر خدمت",
      completed: false, // TODO
      current: currentStepId === 6,
    }
  ];

  const currentStep = steps.find(s => s.current);

  const handleStartStep = (stepId: number) => {
    switch (stepId) {
      case 1:
        router.push("/app/become-sitter/address");
        break;
      // Add other cases as we implement them
      default:
        break;
    }
  };

  const getStatusBadge = (step: any) => {
    if (step.completed) return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">تکمیل شده</Badge>;
    if (step.pending) return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">در حال بررسی</Badge>;
    if (step.rejected) return <Badge variant="destructive">رد شده</Badge>;
    if (step.expired) return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">منقضی شده</Badge>;
    return null;
  };

  const getStatusIcon = (step: any) => {
    if (step.completed) return <CheckCircle2 className="w-6 h-6" />;
    if (step.rejected) return <XCircle className="w-6 h-6" />;
    if (step.expired) return <RotateCcw className="w-6 h-6" />;
    if (step.pending) return <Clock className="w-6 h-6 animate-pulse" />;
    return <span className="text-sm font-bold">{step.id}</span>;
  };

  const getStatusColor = (step: any) => {
    if (step.completed) return "border-green-500 text-green-500";
    if (step.pending) return "border-yellow-500 text-yellow-500";
    if (step.rejected) return "border-red-500 text-red-500";
    if (step.expired) return "border-orange-500 text-orange-500";
    if (step.current) return "border-primary text-primary animate-pulse";
    return "border-slate-300 text-slate-300";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">مسیر تبدیل شدن به میزبان</h2>
        <p className="text-muted-foreground">
          برای شروع فعالیت به عنوان میزبان، لطفا مراحل زیر را تکمیل کنید.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>وضعیت حساب کاربری</CardTitle>
              <CardDescription className="mt-2">
                {currentStep ? `مرحله فعلی: ${currentStep.title}` : "در حال بررسی وضعیت..."}
              </CardDescription>
            </div>
            {currentStep && !currentStep.pending && (
              <Button onClick={() => handleStartStep(currentStep.id)}>
                {currentStep.rejected || currentStep.expired ? "بررسی و ارسال مجدد" : "ادامه تکمیل اطلاعات"}
                <ArrowRight className="mr-2 w-4 h-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            {steps.map((step) => (
              <div key={step.id} className={cn("relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active", {
                "opacity-50": !step.current && !step.completed && !step.pending && !step.rejected && !step.expired
              })}>

                {/* Icon */}
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 bg-white transition-colors duration-300",
                  getStatusColor(step)
                )}>
                  {getStatusIcon(step)}
                </div>

                {/* Card */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={cn("font-bold text-lg", {
                      "text-green-600": step.completed,
                      "text-primary": step.current,
                      "text-red-600": step.rejected,
                      "text-orange-600": step.expired,
                      "text-yellow-600": step.pending
                    })}>{step.title}</h3>
                    {getStatusBadge(step)}
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>

                  {/* Rejection Reason */}
                  {(step.rejected || step.expired) && step.rejectionReason && (
                    <div className="mt-3 p-3 bg-red-50 rounded-lg text-sm text-red-700 border border-red-100 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                      <div>
                        <strong>علت {step.rejected ? "رد شدن" : "انقضا"}:</strong> {step.rejectionReason}
                      </div>
                    </div>
                  )}

                  {/* Pending Message */}
                  {step.pending && (
                    <div className="mt-3 p-3 bg-yellow-50 rounded-lg text-sm text-yellow-700 border border-yellow-100 flex items-center gap-2">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span>اطلاعات شما در حال بررسی توسط کارشناسان است. لطفا شکیبا باشید.</span>
                    </div>
                  )}

                  {/* Action Button */}
                  {step.current && !step.pending && (
                    <Button
                      size="sm"
                      className={cn("mt-4 w-full md:w-auto", {
                        "bg-red-600 hover:bg-red-700": step.rejected,
                        "bg-orange-500 hover:bg-orange-600": step.expired
                      })}
                      variant={step.rejected || step.expired ? "default" : "outline"}
                      onClick={() => handleStartStep(step.id)}
                    >
                      {step.rejected || step.expired ? "اصلاح و ارسال مجدد" : "شروع این مرحله"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
