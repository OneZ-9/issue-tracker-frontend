import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createSpaceFormSchema,
  updateSpaceFormSchema,
  type CreateSpacePayload,
  type UpdateSpacePayload,
} from "@/validators/space-validators";
import useCreateSpace from "@/hooks/space/useCreateSpace";
import useUpdateSpace from "@/hooks/space/useUpdateSpace";
import useSpaceById from "@/hooks/space/useSpaceById";

import {
  Card,
  CardContent,
  //   CardDescription,
  CardHeader,
  //   CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorAlert from "@/components/custom/ErrorAlert";
import { useToast } from "@/components/custom/Toast";

type SpaceFormProps = {
  spaceId?: string;
};

const defaultValues = {
  name: "",
  description: "",
};

function SpaceForm({ spaceId }: SpaceFormProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEditSession = Boolean(spaceId);

  const { space, isPending: isLoadingSpace } = useSpaceById({
    spaceId: spaceId ?? "",
  });
  const { createSpaceApi, isPending: isCreating } = useCreateSpace();
  const { updateSpaceApi, isPending: isUpdating } = useUpdateSpace();

  const isPending = isCreating || isUpdating;
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<CreateSpacePayload | UpdateSpacePayload>({
    resolver: zodResolver(
      isEditSession ? updateSpaceFormSchema : createSpaceFormSchema,
    ),
    defaultValues,
  });

  // Populate form when editing and the space data arrives
  useEffect(() => {
    if (isEditSession && space) {
      form.reset({
        name: space.name ?? "",
        description: space.description ?? "",
      });
    }
  }, [isEditSession, space, form]);

  // Submit handler
  const onSubmit = (data: CreateSpacePayload | UpdateSpacePayload) => {
    setErrorMessage("");

    if (isEditSession && spaceId) {
      // Update existing space
      updateSpaceApi(
        { spaceId, reqBody: data as UpdateSpacePayload },
        {
          onSuccess: () => {
            showToast(
              "success",
              "Space updated",
              "Space updated successfully.",
            );
            navigate(`/issue-tracker/spaces/${spaceId}`, { replace: true });
          },
          onError: (error) => {
            showToast("error", "Failed to update space", error.message);
            setErrorMessage(
              error.response?.data?.message ??
                "Failed to update space. Please try again.",
            );
          },
        },
      );
    } else {
      // Create new space
      createSpaceApi(
        { reqBody: data as CreateSpacePayload },
        {
          onSuccess: (response) => {
            showToast(
              "success",
              "Space created",
              "Space created successfully.",
            );
            // Navigate to the newly created space
            navigate(`/issue-tracker/spaces/${response.data._id}`, {
              replace: true,
            });
          },
          onError: (error) => {
            setErrorMessage(
              error.response?.data?.message ??
                "Failed to create space. Please try again.",
            );
            showToast("error", "Failed to create space", error.message);
          },
        },
      );
    }
  };

  // Loading state (edit mode only)
  if (isEditSession && isLoadingSpace) {
    return (
      <Card className="mx-auto w-full max-w-lg">
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-28" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        {/* <CardTitle>{isEditSession ? "Update Space" : "Create Space"}</CardTitle>
        <CardDescription>
          {isEditSession
            ? "Update the details of your space below."
            : "Fill in the details below to create a new space."}
        </CardDescription> */}
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FieldGroup>
            {/* Space Name */}
            <Field>
              <FieldLabel htmlFor="name">
                Name{" "}
                {!isEditSession && <span className="text-destructive">*</span>}
              </FieldLabel>
              <Controller
                name="name"
                control={form.control}
                render={({ field }) => (
                  <Input
                    id="name"
                    placeholder="e.g. Frontend, Design, Marketing"
                    disabled={isPending}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setErrorMessage("");
                    }}
                  />
                )}
              />
              <FieldError>{form.formState.errors.name?.message}</FieldError>
            </Field>

            {/* Description */}
            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Controller
                name="description"
                control={form.control}
                render={({ field }) => (
                  <Textarea
                    id="description"
                    placeholder="Briefly describe what this space is for (optional)"
                    rows={4}
                    disabled={isPending}
                    className="resize-none"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setErrorMessage("");
                    }}
                  />
                )}
              />
              <FieldError>
                {form.formState.errors.description?.message}
              </FieldError>
            </Field>
          </FieldGroup>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={isPending}>
              {isPending
                ? isEditSession
                  ? "Saving…"
                  : "Creating…"
                : isEditSession
                  ? "Save Changes"
                  : "Create Space"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </div>
        </form>

        {errorMessage && (
          <ErrorAlert errorMessage={errorMessage} className="mt-2" />
        )}
      </CardContent>
    </Card>
  );
}

export default SpaceForm;
