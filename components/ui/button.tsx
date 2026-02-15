import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "focus-glow inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 ease-in-out disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-card hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-dropdown active:translate-y-0",
        accent: "bg-accent text-accent-foreground shadow-card hover:-translate-y-0.5 hover:bg-[hsl(var(--accent-dark))] hover:shadow-dropdown active:translate-y-0",
        secondary: "bg-secondary text-secondary-foreground hover:bg-muted",
        outline: "border border-input bg-transparent text-foreground hover:bg-muted",
        ghost: "text-muted-foreground hover:bg-primary/10 hover:text-primary",
        destructive: "bg-destructive text-destructive-foreground hover:brightness-95"
      },
      size: {
        default: "h-11 px-5 py-3",
        sm: "h-10 px-4 py-2",
        lg: "h-12 px-6 py-3",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
