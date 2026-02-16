"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function QueryState({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null;
  return (
    <div className="grid gap-3">
      <Skeleton className="h-16" />
      <Skeleton className="h-16" />
      <Skeleton className="h-16" />
    </div>
  );
}
