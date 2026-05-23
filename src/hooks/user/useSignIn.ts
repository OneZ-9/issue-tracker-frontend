import { useMutation } from "@tanstack/react-query";
import UserService from "@/api/services/UserService";
import type { ApiErrorResponse } from "@/types/ErrorResponse";
import type { AxiosError } from "axios";

function useSignIn() {
  const {
    mutate: signInApi,
    isPending,
    error,
    isError,
  } = useMutation<
    Awaited<ReturnType<typeof UserService.signIn>>,
    AxiosError<ApiErrorResponse>,
    Parameters<typeof UserService.signIn>[0]
  >({
    mutationFn: UserService.signIn,
  });
  return { signInApi, isPending, error, isError };
}

export default useSignIn;
