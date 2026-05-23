import { useMutation, useQueryClient } from "@tanstack/react-query";
import TicketService from "@/api/services/TicketService";
import type { ApiErrorResponse } from "@/types/ErrorResponse";
import type { AxiosError } from "axios";

function useDeleteTicket() {
  const queryClient = useQueryClient();
  const {
    mutate: deleteTicketApi,
    isPending,
    error,
    isError,
  } = useMutation<
    Awaited<ReturnType<typeof TicketService.deleteTicket>>,
    AxiosError<ApiErrorResponse>,
    Parameters<typeof TicketService.deleteTicket>[0]
  >({
    mutationFn: TicketService.deleteTicket,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["ticket", variables.spaceId, variables.ticketId],
      });
      queryClient.invalidateQueries({
        queryKey: ["tickets", variables.spaceId],
      });
    },
  });

  return { deleteTicketApi, isPending, error, isError };
}

export default useDeleteTicket;
