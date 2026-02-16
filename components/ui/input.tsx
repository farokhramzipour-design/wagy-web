import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-xl border border-input bg-white px-3 py-2 text-sm outline-none ring-primary/20 placeholder:text-muted-foreground focus:ring-2",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
