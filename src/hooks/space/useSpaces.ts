import { useQuery } from "@tanstack/react-query";
import SpaceService from "@/api/services/SpaceService";
import type { ApiErrorResponse } from "@/types/ErrorResponse";
import type { AxiosError } from "axios";

function useSpaces() {
  const {
    data,
    isLoading: isPending,
    error,
    isError,
  } = useQuery<
    Awaited<ReturnType<typeof SpaceService.getSpaces>>,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["spaces"],
    queryFn: SpaceService.getSpaces,
  });

  const spaces = data?.data || [];
  return { spaces, isPending, error, isError };
}

export default useSpaces;
