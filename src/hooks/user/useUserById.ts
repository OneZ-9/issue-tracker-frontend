import { useQuery } from "@tanstack/react-query";
import UserService from "@/api/services/UserService";
import type { ApiErrorResponse } from "@/types/ErrorResponse";
import type { AxiosError } from "axios";

function useUserById({ userId }: { userId: string }) {
  const {
    data,
    isLoading: isPending,
    error,
    isError,
  } = useQuery<
    Awaited<ReturnType<typeof UserService.getUserById>>,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["user", userId],
    queryFn: () => UserService.getUserById({ userId }),
    enabled: Boolean(userId),
  });

  const user = data?.data || null;
  return { user, isPending, error, isError };
}

export default useUserById;
