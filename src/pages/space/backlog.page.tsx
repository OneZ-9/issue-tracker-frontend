import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useParams } from "react-router";
import { Loader2Icon } from "lucide-react";

import TicketStrip from "@/features/ticket/TicketStrip";
import TicketDetailSheet from "@/features/ticket/TicketDetailSheet";
import TicketStatsBar from "@/features/ticket/TicketStatsBar";
import ExportButton from "@/features/ticket/ExportButton";
import PriorityDropdown from "@/components/custom/PriorityDropdown";
import SeverityDropdown from "@/components/custom/SeverityDropdown";
import AssigneeDropdown from "@/components/custom/AssigneeDropdown";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useTickets from "@/hooks/ticket/useTickets";
import { useDebounce } from "@/hooks/useDebounce";
import { TICKET_STATUS } from "@/constants/ticket-constants";
import type {
  Ticket,
  TicketPriority,
  TicketSeverity,
  TicketStatus,
} from "@/types/Ticket";
import type { ListTicketsQuery } from "@/validators/ticket-validators";

type Filters = Omit<
  ListTicketsQuery,
  "page" | "limit" | "sortBy" | "sortOrder"
>;

const ALL_VALUE = "__all__";
const PAGE_LIMIT = 10;

function BacklogPage() {
  const { spaceId = "" } = useParams<{ spaceId: string }>();
  const { ref: sentinelRef, inView } = useInView({ threshold: 0.1 });

  /* Filters state  */
  const [searchRaw, setSearchRaw] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "">("");
  const [priorityFilter, setPriorityFilter] = useState<
    TicketPriority | undefined
  >(undefined);
  const [severityFilter, setSeverityFilter] = useState<
    TicketSeverity | undefined
  >(undefined);
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null);
  const debouncedSearch = useDebounce(searchRaw, 400);

  /*  Build query params  */
  const params: Filters = {};
  if (debouncedSearch) params.search = debouncedSearch;
  if (statusFilter) params.status = statusFilter;
  if (priorityFilter) params.priority = priorityFilter;
  if (severityFilter) params.severity = severityFilter;
  if (assigneeFilter) params.assignee = assigneeFilter;

  /* Tickets query  */
  const { tickets, isPending, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useTickets({ spaceId, params: { ...params, limit: PAGE_LIMIT } });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  /*  Sheet state  */
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicketId(ticket._id);
    setSheetOpen(true);
  };

  const hasActiveFilters =
    !!statusFilter ||
    !!priorityFilter ||
    !!severityFilter ||
    !!assigneeFilter ||
    !!searchRaw;

  const clearFilters = () => {
    setSearchRaw("");
    setStatusFilter("");
    setPriorityFilter(undefined);
    setSeverityFilter(undefined);
    setAssigneeFilter(null);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Stats bar: shows Open / In Progress / Resolved / Total counts */}
      <TicketStatsBar spaceId={spaceId} />

      {/* Filters bar  */}
      <div className="flex flex-wrap items-center gap-2 border-b px-4 py-3">
        <Input
          placeholder="Search tickets…"
          value={searchRaw}
          onChange={(e) => setSearchRaw(e.target.value)}
          className="h-8 w-56 text-sm"
        />

        <Select
          value={statusFilter || ALL_VALUE}
          onValueChange={(v) =>
            setStatusFilter(v === ALL_VALUE ? "" : (v as TicketStatus))
          }
        >
          <SelectTrigger className="h-8 w-36 text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>All statuses</SelectItem>
            <SelectItem value={TICKET_STATUS.OPEN}>Open</SelectItem>
            <SelectItem value={TICKET_STATUS.IN_PROGRESS}>
              In Progress
            </SelectItem>
            <SelectItem value={TICKET_STATUS.RESOLVED}>Resolved</SelectItem>
          </SelectContent>
        </Select>

        <PriorityDropdown
          value={priorityFilter}
          onChange={(v) => setPriorityFilter(v)}
          className="h-8 text-xs"
        />

        <SeverityDropdown
          value={severityFilter}
          onChange={(v) => setSeverityFilter(v)}
          className="h-8 text-xs"
        />

        <AssigneeDropdown
          value={assigneeFilter}
          onChange={(v) => setAssigneeFilter(v)}
          className="h-8 text-xs"
        />

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
            onClick={clearFilters}
          >
            Clear
          </Button>
        )}

        {/* Export button — passes current filter params so export matches visible list */}
        <ExportButton spaceId={spaceId} filterParams={params} />
      </div>

      {/*  Ticket list */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {isPending ? (
          <div className="divide-y">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="size-4 rounded-full" />
                <Skeleton className="size-4 rounded-full" />
                <Skeleton className="size-6 rounded-full" />
              </div>
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 py-24 text-sm">
            <span>No tickets found</span>
            {hasActiveFilters && (
              <Button
                variant="link"
                size="sm"
                className="text-xs"
                onClick={clearFilters}
              >
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y">
            {tickets.map((ticket) => (
              <TicketStrip
                key={ticket._id}
                ticket={ticket}
                spaceId={spaceId}
                onView={handleViewTicket}
              />
            ))}

            {/* Sentinel div — when it enters the viewport, useInView fires
                inView=true which triggers fetchNextPage() in the useEffect above */}
            <div ref={sentinelRef} className="h-1" />

            {isFetchingNextPage && (
              <div className="flex justify-center py-4">
                <Loader2Icon className="text-muted-foreground size-5 animate-spin" />
              </div>
            )}
          </div>
        )}
      </div>

      <TicketDetailSheet
        spaceId={spaceId}
        ticketId={selectedTicketId}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}

export default BacklogPage;
