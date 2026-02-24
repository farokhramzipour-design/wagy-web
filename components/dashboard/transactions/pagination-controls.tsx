"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface PaginationControlsProps {
  hasMore: boolean;
  t: any; // Translation object
  lang: string;
}

export function PaginationControls({ hasMore, t, lang }: PaginationControlsProps) {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const isRtl = lang === "fa";

  const prevPage = page > 1 ? page - 1 : 1;
  const nextPage = page + 1;

  const createPageUrl = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", p.toString());
    return `?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      <Button
        variant="outline"
        size="sm"
        asChild={page > 1}
        disabled={page <= 1}
      >
        {page <= 1 ? (
          <span className="flex items-center gap-2 pointer-events-none opacity-50">
            {isRtl ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            {t.pagination?.prev || "Previous"}
          </span>
        ) : (
          <Link href={createPageUrl(prevPage)} className="flex items-center gap-2">
            {isRtl ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            {t.pagination?.prev || "Previous"}
          </Link>
        )}
      </Button>

      <span className="text-sm text-neutral-600 font-medium">
        {t.pagination?.page || "Page"} {page}
      </span>

      <Button
        variant="outline"
        size="sm"
        asChild={hasMore}
        disabled={!hasMore}
      >
        {!hasMore ? (
          <span className="flex items-center gap-2 pointer-events-none opacity-50">
            {t.pagination?.next || "Next"}
            {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </span>
        ) : (
          <Link href={createPageUrl(nextPage)} className="flex items-center gap-2">
            {t.pagination?.next || "Next"}
            {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Link>
        )}
      </Button>
    </div>
  );
}
