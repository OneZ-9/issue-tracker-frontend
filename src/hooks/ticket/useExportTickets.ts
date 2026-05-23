import { useQuery } from "@tanstack/react-query";
import TicketService from "@/api/services/TicketService";
import type { ApiErrorResponse } from "@/types/ErrorResponse";
import type { AxiosError } from "axios";
import type { ExportTicketsQuery } from "@/validators/ticket-validators";

function useExportTickets({
  spaceId,
  params,
  enabled = false,
}: {
  spaceId: string;
  params?: ExportTicketsQuery;
  enabled?: boolean;
}) {
  const {
    data,
    isLoading: isPending,
    error,
    isError,
    refetch: exportTickets,
  } = useQuery<
    Awaited<ReturnType<typeof TicketService.exportTickets>>,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["tickets-export", spaceId, params],
    queryFn: () => TicketService.exportTickets({ spaceId, params }),
    enabled,
  });

  return { data, exportTickets, isPending, error, isError };
}

export default useExportTickets;
