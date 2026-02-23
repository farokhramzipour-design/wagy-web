"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api-client";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { ProfileBasicPayload, ProfileMeResponse, updateProfileBasic } from "@/services/profile-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const content = { en, fa };

const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  date_of_birth: z.date(),
  bio: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface BasicInfoFormProps {
  profile: ProfileMeResponse;
  accessToken?: string;
}

export function BasicInfoForm({ profile, accessToken }: BasicInfoFormProps) {
  const { lang } = useLanguage();
  const t = useMemo(() => content[lang], [lang]);
  const tBasic = t.profile.basicInfo;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      date_of_birth: profile.date_of_birth ? new Date(profile.date_of_birth) : undefined,
      bio: profile.bio || "",
    },
  });

  const dateOfBirth = watch("date_of_birth");

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const payload: ProfileBasicPayload = {
        first_name: data.first_name,
        last_name: data.last_name,
        date_of_birth: format(data.date_of_birth, "yyyy-MM-dd"),
        bio: data.bio || "",
      };

      await updateProfileBasic(payload, accessToken);
      toast.success(tBasic.success);
    } catch (error) {
      console.error("Failed to update profile", error);
      if (error instanceof ApiError && error.payload) {
        const errorMessage = (error.payload as any).message || (error.payload as any).detail || tBasic.error;
        toast.error(errorMessage);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(tBasic.error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tBasic.title}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">{tBasic.firstName}</Label>
              <Input
                id="first_name"
                {...register("first_name")}
                className={errors.first_name ? "border-red-500" : ""}
              />
              {errors.first_name && (
                <p className="text-sm text-red-500">{errors.first_name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">{tBasic.lastName}</Label>
              <Input
                id="last_name"
                {...register("last_name")}
                className={errors.last_name ? "border-red-500" : ""}
              />
              {errors.last_name && (
                <p className="text-sm text-red-500">{errors.last_name.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>{tBasic.dateOfBirth}</Label>
            <div className={errors.date_of_birth ? "border rounded-md border-red-500" : ""}>
              <DatePicker
                date={dateOfBirth}
                setDate={(date) => setValue("date_of_birth", date as Date, { shouldValidate: true })}
                locale={lang as "en" | "fa"}
                placeholder={tBasic.dateOfBirth}
                fromYear={new Date().getFullYear() - 100}
                toYear={new Date().getFullYear()}
              />
            </div>
            {errors.date_of_birth && (
              <p className="text-sm text-red-500">{errors.date_of_birth.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">{tBasic.bio}</Label>
            <Textarea
              id="bio"
              {...register("bio")}
              className={`min-h-[100px] ${errors.bio ? "border-red-500" : ""}`}
            />
            {errors.bio && (
              <p className="text-sm text-red-500">{errors.bio.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? tBasic.saving : tBasic.save}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
