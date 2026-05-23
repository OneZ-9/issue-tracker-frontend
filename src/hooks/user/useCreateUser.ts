import { useMutation } from "@tanstack/react-query";
import UserService from "@/api/services/UserService";
import type { ApiErrorResponse } from "@/types/ErrorResponse";
import type { AxiosError } from "axios";

function useCreateUser() {
  const {
    mutate: createUserApi,
    isPending,
    error,
    isError,
  } = useMutation<
    Awaited<ReturnType<typeof UserService.createUser>>,
    AxiosError<ApiErrorResponse>,
    Parameters<typeof UserService.createUser>[0]
  >({
    mutationFn: UserService.createUser,
  });

  return { createUserApi, isPending, error, isError };
}

export default useCreateUser;
