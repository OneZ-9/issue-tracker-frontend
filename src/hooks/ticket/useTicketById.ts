import { useQuery } from "@tanstack/react-query";
import TicketService from "@/api/services/TicketService";
import type { ApiErrorResponse } from "@/types/ErrorResponse";
import type { AxiosError } from "axios";

function useTicketById({
  spaceId,
  ticketId,
}: {
  spaceId: string;
  ticketId: string;
}) {
  const {
    data,
    isLoading: isPending,
    error,
    isError,
  } = useQuery<
    Awaited<ReturnType<typeof TicketService.getTicketById>>,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["ticket", spaceId, ticketId],
    queryFn: () => TicketService.getTicketById({ spaceId, ticketId }),
  });

  const ticket = data?.data || null;
  return { ticket, isPending, error, isError };
}

export default useTicketById;
