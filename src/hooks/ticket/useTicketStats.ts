import { useQuery } from "@tanstack/react-query";
import TicketService from "@/api/services/TicketService";
import type { ApiErrorResponse } from "@/types/ErrorResponse";
import type { AxiosError } from "axios";

function useTicketStats({ spaceId }: { spaceId: string }) {
  const {
    data,
    isLoading: isPending,
    error,
    isError,
  } = useQuery<
    Awaited<ReturnType<typeof TicketService.getTicketStats>>,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["ticket-stats", spaceId],
    queryFn: () => TicketService.getTicketStats({ spaceId }),
  });

  const stats = data?.data || null;
  return { stats, isPending, error, isError };
}

export default useTicketStats;
