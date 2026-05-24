import { PRIORITY_CONFIG } from "@/components/custom/PriorityDropdown";
import { SEVERITY_CONFIG } from "@/components/custom/SeverityDropdown";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TicketMoreActions from "@/features/ticket/TicketMoreActions";
import { cn } from "@/lib/utils";
import type { Ticket } from "@/types/Ticket";
import type { User } from "@/types/User";

type TicketStripProps = {
  ticket: Ticket;
  spaceId: string;
  onView: (ticket: Ticket) => void;
};

function TicketStrip({ ticket, spaceId, onView }: TicketStripProps) {
  const priorityConfig = ticket.priority
    ? PRIORITY_CONFIG[ticket.priority]
    : null;
  const severityConfig = ticket.severity
    ? SEVERITY_CONFIG[ticket.severity]
    : null;

  const assignee =
    ticket.assignee && typeof ticket.assignee === "object"
      ? (ticket.assignee as Partial<User>)
      : null;

  return (
    <div
      role="button"
      tabIndex={0}
      className="group hover:bg-accent/50 flex cursor-pointer items-center gap-3 border-b px-4 py-2.5 transition-colors last:border-b-0 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
      onClick={() => onView(ticket)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onView(ticket)}
    >
      {/* Ticket ID */}
      <span className="text-muted-foreground w-16 shrink-0 font-mono text-xs">
        {ticket.ticketId}
      </span>

      {/* Title */}
      <span className="min-w-0 flex-1 truncate text-sm">{ticket.title}</span>

      {/* Priority + Severity icons */}
      <div className="flex shrink-0 items-center gap-4">
        {priorityConfig && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex items-center">
                <priorityConfig.icon
                  className={cn("size-4", priorityConfig.colorClass)}
                />
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">
              {priorityConfig.label} priority
            </TooltipContent>
          </Tooltip>
        )}
        {severityConfig && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex items-center">
                <severityConfig.icon
                  className={cn("size-4", severityConfig.colorClass)}
                />
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">
              {severityConfig.label} severity
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Assignee avatar */}
      <div className="w-7 shrink-0">
        {assignee?.name ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="size-6">
                <AvatarFallback className="text-xs">
                  {assignee.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent side="top">{assignee.name}</TooltipContent>
          </Tooltip>
        ) : null}
      </div>

      {/* More actions */}
      <TicketMoreActions
        ticket={ticket}
        spaceId={spaceId}
        onView={() => onView(ticket)}
      />
    </div>
  );
}

export default TicketStrip;
