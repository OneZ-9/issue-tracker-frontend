import { useMutation } from "@tanstack/react-query";
import OTPService from "@/api/services/OTPService";
import type { ApiErrorResponse } from "@/types/ErrorResponse";
import type { AxiosError } from "axios";

function useOTPRequest() {
  const {
    mutate: requestOTPApi,
    isPending,
    error,
    isError,
  } = useMutation<
    Awaited<ReturnType<typeof OTPService.requestOTP>>,
    AxiosError<ApiErrorResponse>,
    Parameters<typeof OTPService.requestOTP>[0]
  >({
    mutationFn: OTPService.requestOTP,
  });
  return { requestOTPApi, isPending, error, isError };
}

export default useOTPRequest;
