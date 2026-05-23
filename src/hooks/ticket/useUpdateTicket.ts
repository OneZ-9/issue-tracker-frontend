import { useMutation, useQueryClient } from "@tanstack/react-query";
import TicketService from "@/api/services/TicketService";
import type { ApiErrorResponse } from "@/types/ErrorResponse";
import type { AxiosError } from "axios";

function useUpdateTicket() {
  const queryClient = useQueryClient();
  const {
    mutate: updateTicketApi,
    isPending,
    error,
    isError,
  } = useMutation<
    Awaited<ReturnType<typeof TicketService.updateTicket>>,
    AxiosError<ApiErrorResponse>,
    Parameters<typeof TicketService.updateTicket>[0]
  >({
    mutationFn: TicketService.updateTicket,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["ticket", variables.spaceId, variables.ticketId],
      });
      queryClient.invalidateQueries({
        queryKey: ["tickets", variables.spaceId],
      });
    },
  });

  return { updateTicketApi, isPending, error, isError };
}

export default useUpdateTicket;
