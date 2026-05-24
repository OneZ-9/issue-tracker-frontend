import { useState } from "react";
import { useNavigate } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "./authSlice";
import useSignIn from "@/hooks/user/useSignIn";
import { useAppDispatch } from "@/hooks/redux";
import {
  signInFormSchema,
  type SignInFormValues,
} from "@/validators/user-validators";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import PasswordInput from "@/components/custom/PasswordInput";
import ErrorAlert from "@/components/custom/ErrorAlert";

const defaultValues = { email: "", password: "", rememberMe: true };

function SignInForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { signInApi, isPending: isSigningIn } = useSignIn();
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues,
  });

  const clearError = () => setErrorMessage("");

  const onSubmit = (data: SignInFormValues) => {
    const { rememberMe, ...credentials } = data;
    signInApi(
      { reqBody: credentials },
      {
        onSuccess: (response) => {
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
              rememberMe,
              signupPending: null,
            }),
          );
          navigate("/issue-tracker/spaces", { replace: true });
        },
        onError: (error) => {
          setErrorMessage(
            error.response?.data?.message ??
              "Something went wrong while signing in, please try again.",
          );
        },
      },
    );
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign in to your account</CardTitle>
        <CardDescription>
          Enter your email below to sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FieldGroup>
            {/* Email */}
            <Field>
              <FieldLabel htmlFor="email">
                Email <span className="text-destructive">*</span>
              </FieldLabel>
              <Controller
                name="email"
                control={form.control}
                render={({ field }) => (
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    disabled={isSigningIn}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      clearError();
                    }}
                  />
                )}
              />
              <FieldError>{form.formState.errors.email?.message}</FieldError>
            </Field>

            {/* Password */}
            <Field>
              <FieldLabel htmlFor="password">
                Password <span className="text-destructive">*</span>
              </FieldLabel>
              <Controller
                name="password"
                control={form.control}
                render={({ field }) => (
                  <PasswordInput
                    id="password"
                    placeholder="Enter your password"
                    disabled={isSigningIn}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      clearError();
                    }}
                  />
                )}
              />
              <FieldError>{form.formState.errors.password?.message}</FieldError>
            </Field>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <Controller
                name="rememberMe"
                control={form.control}
                render={({ field }) => (
                  <Checkbox
                    id="rememberMe"
                    disabled={isSigningIn}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label
                htmlFor="rememberMe"
                className="text-muted-foreground cursor-pointer text-sm font-normal"
              >
                Remember me
              </Label>
            </div>
          </FieldGroup>

          <Button type="submit" className="w-full" disabled={isSigningIn}>
            {isSigningIn ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        {errorMessage && (
          <ErrorAlert errorMessage={errorMessage} className="mt-2" />
        )}

        <p className="text-muted-foreground text-center text-sm">
          Don&apos;t have an account?{" "}
          <a
            href="/auth/sign-up"
            className="hover:text-foreground underline underline-offset-4"
          >
            Sign up
          </a>
        </p>
      </CardContent>
    </Card>
  );
}

export default SignInForm;
