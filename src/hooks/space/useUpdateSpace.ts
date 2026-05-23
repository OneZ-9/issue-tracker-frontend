import { useMutation, useQueryClient } from "@tanstack/react-query";
import SpaceService from "@/api/services/SpaceService";
import type { ApiErrorResponse } from "@/types/ErrorResponse";
import type { AxiosError } from "axios";

function useUpdateSpace() {
  const queryClient = useQueryClient();
  const {
    mutate: updateSpaceApi,
    isPending,
    error,
    isError,
  } = useMutation<
    Awaited<ReturnType<typeof SpaceService.updateSpace>>,
    AxiosError<ApiErrorResponse>,
    Parameters<typeof SpaceService.updateSpace>[0]
  >({
    mutationFn: SpaceService.updateSpace,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["space", variables.spaceId] });
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
    },
  });
  return { updateSpaceApi, isPending, error, isError };
}

export default useUpdateSpace;
