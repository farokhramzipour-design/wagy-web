"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getVerificationStatus, VerificationStatusResponse } from "@/services/verification-api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const step1Completed = status?.provider_address?.submitted && status.provider_address.status === "approved";
  const step1Pending = status?.provider_address?.submitted && status.provider_address.status === "pending";
  const step1Rejected = status?.provider_address?.status === "rejected";
  
  const step2Completed = !!phone;
  
  const step3Completed = !!(status?.national_code?.added && status?.shahkar?.verified);
  
  const step4Completed = !!(
    status?.documents?.national_card_front?.status &&
    status?.documents?.national_card_back?.status &&
    status?.documents?.birth_certificate?.status
  );

  // Determine current step
  let currentStepId = 1;
  if (step1Completed) currentStepId = 2;
  if (step1Completed && step2Completed) currentStepId = 3;
  if (step1Completed && step2Completed && step3Completed) currentStepId = 4;
  if (step1Completed && step2Completed && step3Completed && step4Completed) currentStepId = 5;
  // TODO: Add logic for step 5 and 6 completion when available

  // If step 1 is rejected, force back to step 1
  if (step1Rejected) currentStepId = 1;

  const steps = [
    {
      id: 1,
      title: "آدرس و موقعیت مکانی",
      description: "ثبت آدرس دقیق و موقعیت مکانی جهت نمایش به کاربران",
      completed: step1Completed,
      pending: step1Pending,
      rejected: step1Rejected,
      current: currentStepId === 1,
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
      current: currentStepId === 4,
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
                ادامه تکمیل اطلاعات
                <ArrowRight className="mr-2 w-4 h-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            {steps.map((step) => (
              <div key={step.id} className={cn("relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active", {
                "opacity-50": !step.current && !step.completed && !step.pending && !step.rejected
              })}>
                
                {/* Icon */}
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 bg-white transition-colors duration-300",
                  step.completed ? "border-green-500 text-green-500" : 
                  step.pending ? "border-yellow-500 text-yellow-500" :
                  step.rejected ? "border-red-500 text-red-500" :
                  step.current ? "border-primary text-primary animate-pulse" : "border-slate-300 text-slate-300"
                )}>
                  {step.completed ? <CheckCircle2 className="w-6 h-6" /> : 
                   step.rejected ? <AlertCircle className="w-6 h-6" /> :
                   step.pending ? <Loader2 className="w-6 h-6 animate-spin" /> :
                   <span className="text-sm font-bold">{step.id}</span>}
                </div>

                {/* Card */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={cn("font-bold text-lg", {
                      "text-green-600": step.completed,
                      "text-primary": step.current,
                      "text-red-600": step.rejected
                    })}>{step.title}</h3>
                    {step.pending && <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">در حال بررسی</Badge>}
                    {step.rejected && <Badge variant="destructive">رد شده</Badge>}
                    {step.completed && <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">تکمیل شده</Badge>}
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
                  {step.rejected && status?.provider_address?.rejection_reason && (
                    <div className="mt-3 p-3 bg-red-50 rounded-lg text-sm text-red-700 border border-red-100">
                      <strong>علت رد شدن:</strong> {status.provider_address.rejection_reason}
                    </div>
                  )}
                  {step.current && !step.pending && (
                    <Button 
                      size="sm" 
                      className="mt-4 w-full md:w-auto" 
                      variant="outline"
                      onClick={() => handleStartStep(step.id)}
                    >
                      شروع این مرحله
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
