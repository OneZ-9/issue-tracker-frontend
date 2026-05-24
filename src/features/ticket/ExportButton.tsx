import { DownloadIcon, Loader2Icon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import useExportTickets from "@/hooks/ticket/useExportTickets";
import { useToast } from "@/components/custom/Toast";
import type { ExportTicketsQuery } from "@/validators/ticket-validators";

// Download helper
// Creates an <a> element in-memory and clicks it to trigger a browser download.
// For JSON, the response is a parsed object so we re-stringify.
// For CSV, the response is already a plain string.
function triggerDownload(responseData: unknown, format: "csv" | "json") {
  const content =
    format === "json"
      ? JSON.stringify(responseData, null, 2) // re-stringify the parsed JS object
      : String(responseData); // CSV arrives as a raw string

  const mimeType =
    format === "csv" ? "text/csv;charset=utf-8;" : "application/json";

  const timestamp = new Date().toISOString().split("T")[0]; // e.g. "2026-05-24"
  const filename = `tickets-export-${timestamp}.${format}`;

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

//  Props
type ExportButtonProps = {
  spaceId: string;
  // Active filter params from the backlog page (without page/limit/sortBy/sortOrder).
  // Passed through to the export API so the export matches the visible list.
  filterParams?: Omit<ExportTicketsQuery, "format" | "page" | "limit">;
};

// Component
// We instantiate useExportTickets TWICE — once per format.
// This avoids the React state-synchronisation problem that arises when you try
// to set format state and immediately call refetch() in the same event handler
// (state updates are async, so the refetch would fire with the stale value).
// With two fixed-format instances, each refetch() always uses the correct params.
function ExportButton({ spaceId, filterParams }: ExportButtonProps) {
  const { showToast } = useToast();

  // Hook instance for CSV export
  const { exportTickets: refetchCsv, isPending: isExportingCsv } =
    useExportTickets({
      spaceId,
      params: { ...filterParams, format: "csv" },
      enabled: false, // never auto-fetch; we trigger manually via refetch()
    });

  // Hook instance for JSON export
  const { exportTickets: refetchJson, isPending: isExportingJson } =
    useExportTickets({
      spaceId,
      params: { ...filterParams, format: "json" },
      enabled: false,
    });

  const isExporting = isExportingCsv || isExportingJson;

  // Export handler
  // TanStack Query's refetch() returns a Promise<QueryObserverResult>.
  // We can await it directly and access .data on the result — no useEffect needed.
  const handleExport = async (format: "csv" | "json") => {
    try {
      // Call the correct refetch based on chosen format.
      // The hook already has the correct `params` baked in at render time.
      const result = await (format === "csv" ? refetchCsv() : refetchJson());

      if (result.error) {
        throw result.error;
      }

      // get() in axiosClient already returns response.data (the raw body), so
      // result.data from React Query IS the body directly — no extra .data unwrap.
      const responseBody = result.data;
      if (responseBody === undefined || responseBody === null) {
        throw new Error("Empty response from server.");
      }

      triggerDownload(responseBody, format);
      showToast(
        "success",
        "Export complete",
        `Tickets downloaded as ${format.toUpperCase()}.`,
      );
    } catch {
      showToast("error", "Export failed", "Could not download tickets.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="ml-auto h-8 gap-1.5 text-xs"
          disabled={isExporting}
        >
          {isExporting ? (
            <Loader2Icon className="size-3.5 animate-spin" />
          ) : (
            <DownloadIcon className="size-3.5" />
          )}
          Export
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel className="text-xs">
          Export tickets
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* CSV — best for spreadsheets (Excel, Google Sheets) */}
        <DropdownMenuItem
          disabled={isExporting}
          onClick={() => handleExport("csv")}
        >
          Export as CSV
        </DropdownMenuItem>

        {/* JSON — best for programmatic use / API consumers */}
        <DropdownMenuItem
          disabled={isExporting}
          onClick={() => handleExport("json")}
        >
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ExportButton;
