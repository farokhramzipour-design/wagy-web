"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { uploadMediaAction } from "@/app/admin/services/actions";

interface ImageUploadProps {
  value?: number;
  previewUrl?: string;
  onChange: (mediaId: number, url: string) => void;
  onRemove: () => void;
  className?: string;
}

export function ImageUpload({ value, previewUrl, onChange, onRemove, className }: ImageUploadProps) {
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("media_type", "other");

    try {
      const response = await uploadMediaAction(formData);
      onChange(response.media_id, response.url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload image");
    } finally {
      setLoading(false);
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': [],
      'image/jpeg': [],
      'image/webp': []
    },
    maxFiles: 1,
    disabled: loading
  });

  if (previewUrl) {
    return (
      <div className={cn("relative w-40 h-40 rounded-lg overflow-hidden border border-border", className)}>
        <Image
          src={previewUrl}
          alt="Uploaded image"
          fill
          className="object-cover"
        />
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6"
          onClick={onRemove}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "w-40 h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors",
        isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
        loading && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <input {...getInputProps()} />
      {loading ? (
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      ) : (
        <>
          <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
          <span className="text-xs text-muted-foreground text-center px-2">
            {isDragActive ? "Drop image here" : "Upload Icon"}
          </span>
        </>
      )}
    </div>
  );
}
