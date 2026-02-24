"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { verifyNationalCode } from "@/services/verification-api";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const content = { en, fa };

interface IdentityStepProps {
  redirectPath?: string;
  title?: string;
}

export function IdentityStep({ redirectPath = "/app/become-sitter", title }: IdentityStepProps) {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = content[lang].becomeSitter.identityPage;

  const [nationalCode, setNationalCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nationalCode || nationalCode.length !== 10 || !/^\d+$/.test(nationalCode)) {
      if (!/^\d+$/.test(nationalCode)) {
        toast.error(t.validationNumeric);
      } else {
        toast.error(t.validationLength);
      }
      return;
    }

    setIsLoading(true);
    try {
      const response = await verifyNationalCode({ national_code: nationalCode });
      if (response.verified) {
        toast.success(response.message || t.success);
        router.push(redirectPath);
        router.refresh();
      } else {
        toast.error(response.message || t.error);
      }
    } catch (error: any) {
      console.error("Failed to verify national code:", error);
      toast.error(error.message || t.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{title || t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="national-code">
                {t.inputLabel}
              </Label>
              <Input
                id="national-code"
                placeholder={t.inputPlaceholder}
                value={nationalCode}
                onChange={(e) => setNationalCode(e.target.value)}
                maxLength={10}
                dir="ltr"
                className="text-left"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.verifying}
                </>
              ) : (
                t.submitButton
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
