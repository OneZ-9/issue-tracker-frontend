import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { signIn } from "./authSlice";
import useCreateUser from "@/hooks/user/useCreateUser";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import ErrorAlert from "@/components/custom/ErrorAlert";

function OTPForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const signupPending = useAppSelector((state) => state.auth.signupPending);
  const { createUserApi, isPending: isCreatingUser } = useCreateUser();

  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // If user lands here without going through sign-up, redirect back.
  // Skip the guard once account creation succeeded to avoid re-triggering
  // before navigate() resolves (signIn dispatch nulls signupPending first).
  if (!isSuccess && !signupPending) {
    return <Navigate to="/auth/sign-up" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6 || !signupPending) return;

    createUserApi(
      { reqBody: { ...signupPending, otp } },
      {
        onSuccess: (response) => {
          setIsSuccess(true);
          const user = response.data;
          dispatch(
            signIn({
              _id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              isActive: user.isActive,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
              token: user.token,
              refreshToken: user.refreshToken,
              rememberMe: false,
              signupPending: null,
            }),
          );
          navigate("/issue-tracker/spaces", { replace: true });
        },
        onError: (error) => {
          setErrorMessage(
            error.response?.data?.message ??
              "OTP verification failed. Please try again.",
          );
        },
      },
    );
  };

  return (
    <Card className="mx-auto w-full max-w-md py-6">
      <CardHeader>
        <CardTitle>Verify your email</CardTitle>
        <CardDescription>
          We sent a 6-digit code to{" "}
          <span className="text-foreground font-medium">
            {signupPending?.email}
          </span>
          . Enter it below to complete sign-up.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => {
                setOtp(value);
                setErrorMessage("");
              }}
              disabled={isCreatingUser}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isCreatingUser || otp.length !== 6}
          >
            {isCreatingUser ? "Verifying…" : "Verify & Create Account"}
          </Button>
        </form>

        {errorMessage && (
          <ErrorAlert errorMessage={errorMessage} className="mt-2" />
        )}

        <p className="text-muted-foreground text-center text-sm">
          Wrong email?{" "}
          <a
            href="/auth/sign-up"
            className="hover:text-foreground underline underline-offset-4"
          >
            Go back
          </a>
        </p>
      </CardContent>
    </Card>
  );
}

export default OTPForm;
