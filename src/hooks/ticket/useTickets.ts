import { useInfiniteQuery } from "@tanstack/react-query";
import TicketService from "@/api/services/TicketService";
import type { ApiErrorResponse } from "@/types/ErrorResponse";
import type { AxiosError } from "axios";
import type { ListTicketsQuery } from "@/validators/ticket-validators";

type UseTicketsParams = {
  spaceId: string;
  params?: Omit<ListTicketsQuery, "page">;
};

function useTickets({ spaceId, params }: UseTicketsParams) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isPending,
    error,
    isError,
  } = useInfiniteQuery<
    Awaited<ReturnType<typeof TicketService.getTickets>>,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["tickets", spaceId, params],
    queryFn: ({ pageParam }) =>
      TicketService.getTickets({
        spaceId,
        params: { ...params, page: pageParam as number },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { hasNextPage, page } = lastPage.data.pagination;
      return hasNextPage ? page + 1 : undefined;
    },
  });

  const tickets = data?.pages.flatMap((page) => page.data.tickets) ?? [];

  return {
    tickets,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    error,
    isError,
  };
}

export default useTickets;
