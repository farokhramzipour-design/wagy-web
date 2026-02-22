import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HelpCircle } from "lucide-react";
import { useState } from "react";

interface HelpTooltipProps {
  text: string | null | undefined;
}

export function HelpTooltip({ text }: HelpTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!text) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className="inline-flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors focus:outline-none ml-2 rtl:mr-2 rtl:ml-0"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          onClick={(e) => {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }}
          type="button"
        >
          <HelpCircle className="h-4 w-4" />
          <span className="sr-only">Help</span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 text-sm p-3 z-50 pointer-events-none"
        side="top"
        align="center"
      >
        {text}
      </PopoverContent>
    </Popover>
  );
}
