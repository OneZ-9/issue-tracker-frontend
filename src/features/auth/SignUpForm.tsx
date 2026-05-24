import { useState } from "react";
import { useNavigate } from "react-router";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setSignupPending } from "./authSlice";
import useOTPRequest from "@/hooks/OTP/useOTPRequest";
import { useAppDispatch } from "@/hooks/redux";
import {
  signUpFormSchema,
  type SignUpFormValues,
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
import PasswordInput from "@/components/custom/PasswordInput";
import ErrorAlert from "@/components/custom/ErrorAlert";

import { Check, X } from "lucide-react";

const passwordRules = [
  { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "One lowercase letter", test: (v: string) => /[a-z]/.test(v) },
  { label: "One number", test: (v: string) => /[0-9]/.test(v) },
  {
    label: "One special character",
    test: (v: string) => /[^a-zA-Z0-9]/.test(v),
  },
];

const defaultValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function SignUpForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { requestOTPApi, isPending: isRequestingOTP } = useOTPRequest();
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues,
  });

  const passwordValue = useWatch({ control: form.control, name: "password" });
  const clearError = () => setErrorMessage("");

  const onSubmit = (data: SignUpFormValues) => {
    const { name, email, password } = data;
    dispatch(setSignupPending({ name, email, password }));
    requestOTPApi(
      { reqBody: { email } },
      {
        onSuccess: () => {
          navigate("/auth/otp");
        },
        onError: (error) => {
          setErrorMessage(
            error.response?.data?.message ??
              "Failed to send OTP. Please try again.",
          );
        },
      },
    );
  };

  return (
    <Card className="mx-auto h-fit w-full max-w-md">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FieldGroup>
            {/* Name */}
            <Field>
              <FieldLabel htmlFor="name">
                Full Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Controller
                name="name"
                control={form.control}
                render={({ field }) => (
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    disabled={isRequestingOTP}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      clearError();
                    }}
                  />
                )}
              />
              <FieldError>{form.formState.errors.name?.message}</FieldError>
            </Field>

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
                    disabled={isRequestingOTP}
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
                    placeholder="Create a password"
                    disabled={isRequestingOTP}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      clearError();
                    }}
                  />
                )}
              />
              <FieldError>{form.formState.errors.password?.message}</FieldError>
              {/* Password checklist */}
              {passwordValue !== undefined && passwordValue.length > 0 && (
                <ul className="mt-1 space-y-1 text-xs">
                  {passwordRules.map((rule) => {
                    const passed = rule.test(passwordValue);
                    return (
                      <li
                        key={rule.label}
                        className={`flex items-center gap-1.5 ${passed ? "text-green-600" : "text-muted-foreground"}`}
                      >
                        {passed ? (
                          <Check className="size-3 shrink-0" />
                        ) : (
                          <X className="size-3 shrink-0" />
                        )}
                        {rule.label}
                      </li>
                    );
                  })}
                </ul>
              )}
            </Field>

            {/* Confirm Password */}
            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password <span className="text-destructive">*</span>
              </FieldLabel>
              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field }) => (
                  <PasswordInput
                    id="confirmPassword"
                    placeholder="Confirm your password"
                    disabled={isRequestingOTP}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      clearError();
                    }}
                  />
                )}
              />
              <FieldError>
                {form.formState.errors.confirmPassword?.message}
              </FieldError>
            </Field>
          </FieldGroup>

          <Button type="submit" className="w-full" disabled={isRequestingOTP}>
            {isRequestingOTP ? "Sending OTP…" : "Create Account"}
          </Button>
        </form>

        {errorMessage && (
          <ErrorAlert errorMessage={errorMessage} className="mt-2" />
        )}

        <p className="text-muted-foreground text-center text-sm">
          Already have an account?{" "}
          <a
            href="/auth/sign-in"
            className="hover:text-foreground underline underline-offset-4"
          >
            Sign in
          </a>
        </p>
      </CardContent>
    </Card>
  );
}

export default SignUpForm;
