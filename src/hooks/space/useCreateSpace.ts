import { useMutation, useQueryClient } from "@tanstack/react-query";
import SpaceService from "@/api/services/SpaceService";
import type { ApiErrorResponse } from "@/types/ErrorResponse";
import type { AxiosError } from "axios";

function useCreateSpace() {
  const queryClient = useQueryClient();
  const {
    mutate: createSpaceApi,
    isPending,
    error,
    isError,
  } = useMutation<
    Awaited<ReturnType<typeof SpaceService.createSpace>>,
    AxiosError<ApiErrorResponse>,
    Parameters<typeof SpaceService.createSpace>[0]
  >({
    mutationFn: SpaceService.createSpace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["space"] });
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
    },
  });
  return { createSpaceApi, isPending, error, isError };
}

export default useCreateSpace;
