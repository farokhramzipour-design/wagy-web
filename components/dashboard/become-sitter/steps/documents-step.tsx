"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { uploadDocument, VerificationStatusResponse } from "@/services/verification-api";
import { CheckCircle2, Clock, FileUp, Loader2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

const content = { en, fa };

interface DocumentUploadProps {
  type: "national_card_front" | "national_card_back";
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected" | "expired" | null;
  rejectionReason?: string;
  onUploadSuccess: () => void;
}

function DocumentUpload({ type, title, description, status, rejectionReason, onUploadSuccess }: DocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { lang } = useLanguage();
  const t = content[lang].becomeSitter.documentsPage;

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("document_type", type);
    // document_number is optional

    try {
      await uploadDocument(formData);
      toast.success(t.success);
      onUploadSuccess();
    } catch (error: any) {
      console.error("Upload failed:", error);
      toast.error(error.message || t.error);
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/jpg': [],
    },
    maxFiles: 1,
    disabled: isUploading || status === "approved" || status === "pending",
  });

  const getStatusIcon = () => {
    if (status === "approved") return <CheckCircle2 className="h-6 w-6 text-green-500" />;
    if (status === "pending") return <Clock className="h-6 w-6 text-yellow-500" />;
    if (status === "rejected") return <XCircle className="h-6 w-6 text-red-500" />;
    return <FileUp className="h-6 w-6 text-muted-foreground" />;
  };

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="font-medium text-sm">{title}</h4>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        {getStatusIcon()}
      </div>

      {status === "rejected" && rejectionReason && (
        <p className="text-xs text-red-500 bg-red-50 p-2 rounded">
          {rejectionReason}
        </p>
      )}

      {(status === null || status === "rejected" || status === "expired") && (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors text-center",
            isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
            isUploading && "opacity-50 cursor-not-allowed"
          )}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mb-2" />
          ) : (
            <FileUp className="h-6 w-6 text-muted-foreground mb-2" />
          )}
          <span className="text-xs text-muted-foreground">
            {isUploading ? t.uploading : (isDragActive ? "Drop here" : t.nationalCardFront.placeholder)}
          </span>
        </div>
      )}

      {status === "pending" && (
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 text-xs text-yellow-800 flex items-center gap-2">
          <Clock className="h-4 w-4" />
          {t.status.pending}
        </div>
      )}

      {status === "approved" && (
        <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-xs text-green-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          {t.status.approved}
        </div>
      )}
    </div>
  );
}

interface DocumentsStepProps {
  status: VerificationStatusResponse;
  redirectPath?: string;
  title?: string;
}

export function DocumentsStep({ status: initialStatus, redirectPath = "/app/become-sitter", title }: DocumentsStepProps) {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = content[lang].becomeSitter.documentsPage;

  const handleUploadSuccess = () => {
    router.refresh();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{title || t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <DocumentUpload
            type="national_card_front"
            title={t.nationalCardFront.title}
            description={t.nationalCardFront.description}
            status={initialStatus.documents.national_card_front.status}
            rejectionReason={initialStatus.documents.national_card_front.rejection_reason}
            onUploadSuccess={handleUploadSuccess}
          />

          <DocumentUpload
            type="national_card_back"
            title={t.nationalCardBack.title}
            description={t.nationalCardBack.description}
            status={initialStatus.documents.national_card_back.status}
            rejectionReason={initialStatus.documents.national_card_back.rejection_reason}
            onUploadSuccess={handleUploadSuccess}
          />

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => router.push(redirectPath)}>
              {lang === 'fa' ? 'بازگشت' : 'Back'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
