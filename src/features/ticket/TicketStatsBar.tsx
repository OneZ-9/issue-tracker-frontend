import { Circle, CircleDot, CircleCheck, Ticket } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import useTicketStats from "@/hooks/ticket/useTicketStats";

// Types
// The stats API returns an object keyed by status with counts.
// Shape: { total: number; open: number; in_progress: number; resolved: number }
type TicketStats = {
  total?: number;
  open?: number;
  in_progress?: number;
  resolved?: number;
  [key: string]: number | undefined;
};

// Config
// Each card maps a display label to the stat key and visual style.
const STAT_CARDS = [
  {
    label: "Open",
    key: "open",
    icon: Circle,
    iconClass: "text-slate-500",
    valueClass: "text-slate-700 dark:text-slate-200",
    cardClass:
      "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/40",
  },
  {
    label: "Pending",
    key: "in_progress",
    icon: CircleDot,
    iconClass: "text-blue-500",
    valueClass: "text-blue-700 dark:text-blue-300",
    cardClass:
      "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/40",
  },
  {
    label: "Resolved",
    key: "resolved",
    icon: CircleCheck,
    iconClass: "text-green-600",
    valueClass: "text-green-700 dark:text-green-300",
    cardClass:
      "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/40",
  },
  {
    label: "Total",
    key: "total",
    icon: Ticket,
    iconClass: "text-muted-foreground",
    valueClass: "text-foreground",
    cardClass: "border-border bg-muted/30",
  },
] as const;

//  Component
type TicketStatsBarProps = { spaceId: string };

function TicketStatsBar({ spaceId }: TicketStatsBarProps) {
  const { stats, isPending } = useTicketStats({ spaceId });

  // Skeleton while loading
  if (isPending) {
    return (
      <div className="flex gap-3 border-b px-4 py-3">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-18 flex-1 rounded-lg" />
        ))}
      </div>
    );
  }

  const typedStats = stats as TicketStats | null;

  // Derive total from status sum if the API doesn't return it directly
  const computedTotal =
    typedStats?.total ??
    (typedStats?.open ?? 0) +
      (typedStats?.in_progress ?? 0) +
      (typedStats?.resolved ?? 0);

  return (
    <div className="flex gap-3 border-b px-4 py-3 max-md:text-center">
      {STAT_CARDS.map(
        ({ label, key, icon: Icon, iconClass, valueClass, cardClass }) => {
          // Use the computed total for the "total" card if not returned by API
          const count =
            key === "total" ? computedTotal : (typedStats?.[key] ?? 0);

          return (
            <div
              key={key}
              className={cn(
                "flex flex-1 items-center gap-3 rounded-lg border px-4 py-3 max-md:justify-center",
                cardClass,
              )}
            >
              <Icon
                className={cn("hidden size-5 shrink-0 md:block", iconClass)}
              />
              <div className="min-w-0">
                <p
                  className={cn(
                    "leading-none font-semibold md:text-xl",
                    valueClass,
                  )}
                >
                  {count}
                </p>
                <p className="text-muted-foreground mt-1 text-[0.7rem] md:text-xs">
                  {label}
                </p>
              </div>
            </div>
          );
        },
      )}
    </div>
  );
}

export default TicketStatsBar;
