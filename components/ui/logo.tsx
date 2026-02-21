import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Image
      src="/typographic_logo.svg"
      alt="Waggy"
      width={1160}
      height={331}
      className={cn("h-8 w-auto", className)}
      priority
    />
  );
}
