import { useState } from "react";
import {
  ChevronDownIcon,
  CheckIcon,
  ChevronDown,
  ChevronsUp,
  ChevronUp,
  Equal,
} from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TICKET_PRIORITY } from "@/constants/ticket-constants";
import type { TicketPriority } from "@/types/Ticket";

type PriorityConfig = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
};

export const PRIORITY_CONFIG: Record<TicketPriority, PriorityConfig> = {
  [TICKET_PRIORITY.LOW]: {
    label: "Low",
    icon: ChevronDown,
    colorClass: "text-sky-500",
  },
  [TICKET_PRIORITY.MEDIUM]: {
    label: "Medium",
    icon: Equal,
    colorClass: "text-amber-500",
  },
  [TICKET_PRIORITY.HIGH]: {
    label: "High",
    icon: ChevronUp,
    colorClass: "text-red-500",
  },
  [TICKET_PRIORITY.CRITICAL]: {
    label: "Critical",
    icon: ChevronsUp,
    colorClass: "text-rose-900",
  },
};

type PriorityDropdownProps = {
  value?: string;
  onChange: (value: TicketPriority | undefined) => void;
  error?: string;
  className?: string;
  disabled?: boolean;
};

function PriorityDropdown({
  value,
  onChange,
  error,
  className,
  disabled,
}: PriorityDropdownProps) {
  const [open, setOpen] = useState(false);
  const selected = value ? PRIORITY_CONFIG[value as TicketPriority] : null;

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
            <span className="text-muted-foreground">Priority</span>
          )}
          <ChevronDownIcon className="ml-auto size-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-1" align="start">
        {(Object.keys(PRIORITY_CONFIG) as TicketPriority[]).map((key) => {
          const config = PRIORITY_CONFIG[key];
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

export default PriorityDropdown;
