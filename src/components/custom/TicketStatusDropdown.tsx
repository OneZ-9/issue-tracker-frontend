import { useState } from "react";
import { Circle, CircleDot, CircleCheck, ChevronDownIcon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  TICKET_STATUS,
  VALID_STATUS_TRANSITIONS,
} from "@/constants/ticket-constants";
import type { TicketStatus } from "@/types/Ticket";
import useUpdateTicketStatus from "@/hooks/ticket/useUpdateTicketStatus";
import { useToast } from "@/components/custom/Toast";

type StatusConfigEntry = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
  buttonClass: string;
};

const STATUS_CONFIG: Record<TicketStatus, StatusConfigEntry> = {
  [TICKET_STATUS.OPEN]: {
    label: "Open",
    icon: Circle,
    iconClass: "text-slate-500",
    buttonClass:
      "border-slate-200 bg-slate-50 hover:text-slate-700 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
  },
  [TICKET_STATUS.IN_PROGRESS]: {
    label: "In Progress",
    icon: CircleDot,
    iconClass: "text-blue-500",
    buttonClass:
      "border-blue-200 bg-blue-50 hover:text-blue-700 text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300",
  },
  [TICKET_STATUS.RESOLVED]: {
    label: "Resolved",
    icon: CircleCheck,
    iconClass: "text-green-600",
    buttonClass:
      "border-green-200 bg-green-50 hover:text-green-700 text-green-700 hover:bg-green-100 dark:border-green-800 dark:bg-green-950 dark:text-green-300",
  },
};

type TicketStatusDropdownProps = {
  spaceId: string;
  ticketId: string;
  currentStatus: TicketStatus;
  disabled?: boolean;
};

function TicketStatusDropdown({
  spaceId,
  ticketId,
  currentStatus,
  disabled,
}: TicketStatusDropdownProps) {
  const [open, setOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<TicketStatus | null>(null);
  const { updateTicketStatusApi, isPending } = useUpdateTicketStatus();
  const { showToast } = useToast();

  const current = STATUS_CONFIG[currentStatus];
  const CurrentIcon = current.icon;
  const allowedTransitions = [
    ...VALID_STATUS_TRANSITIONS[currentStatus],
  ] as TicketStatus[];

  const applyUpdate = (status: TicketStatus) => {
    updateTicketStatusApi(
      { spaceId, ticketId, reqBody: { status } },
      {
        onSuccess: () =>
          showToast(
            "success",
            "Status updated",
            `Ticket moved to ${STATUS_CONFIG[status].label}.`,
          ),
        onError: (e) =>
          showToast(
            "error",
            "Failed to update status",
            e.response?.data?.message ?? e.message,
          ),
      },
    );
  };

  const handleSelect = (status: TicketStatus) => {
    setOpen(false);
    if (status === TICKET_STATUS.RESOLVED) {
      setPendingStatus(status);
    } else {
      applyUpdate(status);
    }
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || isPending}
            className={cn(
              "h-7 gap-1.5 rounded-xs border text-xs font-medium",
              current.buttonClass,
            )}
          >
            <CurrentIcon className={cn("size-3.5", current.iconClass)} />
            {current.label}
            {allowedTransitions.length > 0 && (
              <ChevronDownIcon className="size-3 opacity-50" />
            )}
          </Button>
        </PopoverTrigger>

        {allowedTransitions.length > 0 && (
          <PopoverContent className="w-44 p-1" align="start">
            {allowedTransitions.map((status) => {
              const config = STATUS_CONFIG[status];
              const Icon = config.icon;
              return (
                <button
                  key={status}
                  type="button"
                  className="hover:bg-accent flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors"
                  onClick={() => handleSelect(status)}
                >
                  <Icon className={cn("size-4", config.iconClass)} />
                  {config.label}
                </button>
              );
            })}
          </PopoverContent>
        )}
      </Popover>

      {/* Confirmation dialog for "resolved" transition */}
      <AlertDialog
        open={!!pendingStatus}
        onOpenChange={(o) => !o && setPendingStatus(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark as Resolved?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this ticket as resolved? This
              indicates the issue has been fully addressed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-green-600! text-white hover:bg-green-700 focus:ring-green-600"
              disabled={isPending}
              onClick={() => {
                if (pendingStatus) {
                  applyUpdate(pendingStatus);
                  setPendingStatus(null);
                }
              }}
            >
              {isPending ? "Saving…" : "Mark Resolved"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export { STATUS_CONFIG };
export default TicketStatusDropdown;
