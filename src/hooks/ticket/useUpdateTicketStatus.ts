import { useMutation, useQueryClient } from "@tanstack/react-query";
import TicketService from "@/api/services/TicketService";
import type { ApiErrorResponse } from "@/types/ErrorResponse";
import type { AxiosError } from "axios";

function useUpdateTicketStatus() {
  const queryClient = useQueryClient();
  const {
    mutate: updateTicketStatusApi,
    isPending,
    error,
    isError,
  } = useMutation<
    Awaited<ReturnType<typeof TicketService.updateTicketStatus>>,
    AxiosError<ApiErrorResponse>,
    Parameters<typeof TicketService.updateTicketStatus>[0]
  >({
    mutationFn: TicketService.updateTicketStatus,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["ticket", variables.spaceId, variables.ticketId],
      });
      queryClient.invalidateQueries({
        queryKey: ["tickets", variables.spaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["ticket-stats", variables.spaceId],
      });
    },
  });

  return { updateTicketStatusApi, isPending, error, isError };
}

export default useUpdateTicketStatus;
