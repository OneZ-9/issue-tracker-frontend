import { useMutation, useQueryClient } from "@tanstack/react-query";
import TicketService from "@/api/services/TicketService";
import type { ApiErrorResponse } from "@/types/ErrorResponse";
import type { AxiosError } from "axios";

function useCreateTicket({ spaceId }: { spaceId: string }) {
  const queryClient = useQueryClient();
  const {
    mutate: createTicketApi,
    isPending,
    error,
    isError,
  } = useMutation<
    Awaited<ReturnType<typeof TicketService.createTicket>>,
    AxiosError<ApiErrorResponse>,
    Parameters<typeof TicketService.createTicket>[0]
  >({
    mutationFn: TicketService.createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets", spaceId] });
    },
  });

  return { createTicketApi, isPending, error, isError };
}

export default useCreateTicket;
