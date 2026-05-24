import { useQuery } from "@tanstack/react-query";
import UserService from "@/api/services/UserService";
import type { ApiErrorResponse } from "@/types/ErrorResponse";
import type { AxiosError } from "axios";

function useUsers() {
  const {
    data,
    isLoading: isPending,
    error,
    isError,
  } = useQuery<
    Awaited<ReturnType<typeof UserService.getUsers>>,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["users"],
    queryFn: UserService.getUsers,
  });

  const users = data?.data || null;
  return { users, isPending, error, isError };
}

export default useUsers;
