import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiErrorResponse } from "@/types/ErrorResponse";
import SpaceService from "@/api/services/SpaceService";
import type { AxiosError } from "axios";

function useDeleteSpace() {
  const queryClient = useQueryClient();
  const {
    mutate: deleteSpaceApi,
    isPending,
    error,
    isError,
  } = useMutation<
    Awaited<ReturnType<typeof SpaceService.deleteSpace>>,
    AxiosError<ApiErrorResponse>,
    Parameters<typeof SpaceService.deleteSpace>[0]
  >({
    mutationFn: SpaceService.deleteSpace,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["space", variables.spaceId] });
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
    },
  });
  return { deleteSpaceApi, isPending, error, isError };
}

export default useDeleteSpace;
