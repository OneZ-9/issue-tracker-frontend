import { useQuery } from "@tanstack/react-query";
import TicketService from "@/api/services/TicketService";
import type { ApiErrorResponse } from "@/types/ErrorResponse";
import type { AxiosError } from "axios";

function useKanban({ spaceId }: { spaceId: string }) {
  const {
    data,
    isLoading: isPending,
    error,
    isError,
  } = useQuery<
    Awaited<ReturnType<typeof TicketService.getKanbanData>>,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["kanban-data"],
    queryFn: () => TicketService.getKanbanData({ spaceId }),
  });

  const kanbanData = data?.data || null;
  return { kanbanData, isPending, error, isError };
}

export default useKanban;
