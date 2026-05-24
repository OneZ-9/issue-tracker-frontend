import { useState } from "react";
import {
  ChevronDownIcon,
  CheckIcon,
  ArrowDown,
  ArrowUp,
  Flame,
  ChevronsRightLeft,
} from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TICKET_SEVERITY } from "@/constants/ticket-constants";
import type { TicketSeverity } from "@/types/Ticket";

type SeverityConfig = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
};

export const SEVERITY_CONFIG: Record<TicketSeverity, SeverityConfig> = {
  [TICKET_SEVERITY.LOW]: {
    label: "Low",
    icon: ArrowDown,
    colorClass: "text-sky-500",
  },
  [TICKET_SEVERITY.MEDIUM]: {
    label: "Medium",
    icon: ChevronsRightLeft,
    colorClass: "text-amber-500",
  },
  [TICKET_SEVERITY.HIGH]: {
    label: "High",
    icon: ArrowUp,
    colorClass: "text-red-500",
  },
  [TICKET_SEVERITY.CRITICAL]: {
    label: "Critical",
    icon: Flame,
    colorClass: "text-rose-900",
  },
};

type SeverityDropdownProps = {
  value?: string;
  onChange: (value: TicketSeverity | undefined) => void;
  error?: string;
  className?: string;
  disabled?: boolean;
};

function SeverityDropdown({
  value,
  onChange,
  error,
  className,
  disabled,
}: SeverityDropdownProps) {
  const [open, setOpen] = useState(false);
  const selected = value ? SEVERITY_CONFIG[value as TicketSeverity] : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          className={cn(
            "h-10 justify-start gap-1.5 text-sm",
            error && "border-destructive",
            className,
          )}
        >
          {selected ? (
            <>
              <selected.icon className={cn("size-5", selected.colorClass)} />
              <span>{selected.label}</span>
            </>
          ) : (
            <span className="text-muted-foreground">Severity</span>
          )}
          <ChevronDownIcon className="ml-auto size-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-1" align="start">
        {(Object.keys(SEVERITY_CONFIG) as TicketSeverity[]).map((key) => {
          const config = SEVERITY_CONFIG[key];
          const Icon = config.icon;
          return (
            <button
              key={key}
              type="button"
              className="hover:bg-accent flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors"
              onClick={() => {
                onChange(key);
                setOpen(false);
              }}
            >
              <Icon className={cn("size-4", config.colorClass)} />
              <span>{config.label}</span>
              {value === key && (
                <CheckIcon className="ml-auto size-3.5 opacity-60" />
              )}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

export default SeverityDropdown;
