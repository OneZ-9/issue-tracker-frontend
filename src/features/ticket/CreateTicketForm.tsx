import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createTicketFormSchema,
  type CreateTicketPayload,
} from "@/validators/ticket-validators";
import useCreateTicket from "@/hooks/ticket/useCreateTicket";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import PriorityDropdown from "@/components/custom/PriorityDropdown";
import SeverityDropdown from "@/components/custom/SeverityDropdown";
import AssigneeDropdown from "@/components/custom/AssigneeDropdown";
import ErrorAlert from "@/components/custom/ErrorAlert";
import { useToast } from "@/components/custom/Toast";

type CreateTicketFormProps = {
  spaceId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

function CreateTicketForm({
  spaceId,
  onSuccess,
  onCancel,
}: CreateTicketFormProps) {
  const { createTicketApi, isPending } = useCreateTicket({ spaceId });
  const { showToast } = useToast();
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<CreateTicketPayload>({
    resolver: zodResolver(createTicketFormSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: undefined,
      severity: undefined,
      assignee: undefined,
    },
  });

  const onSubmit = (data: CreateTicketPayload) => {
    setErrorMessage("");
    createTicketApi(
      { spaceId, reqBody: data },
      {
        onSuccess: () => {
          showToast(
            "success",
            "Ticket created",
            "Ticket created successfully.",
          );
          form.reset();
          onSuccess?.();
        },
        onError: (error) => {
          const msg =
            error.response?.data?.message ??
            "Failed to create ticket. Please try again.";
          setErrorMessage(msg);
          showToast("error", "Failed to create ticket", error.message);
        },
      },
    );
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
    >
      {errorMessage && <ErrorAlert errorMessage={errorMessage} />}

      <FieldGroup>
        {/* Title */}
        <Field>
          <FieldLabel htmlFor="ticket-title">
            Title <span className="text-destructive">*</span>
          </FieldLabel>
          <Controller
            name="title"
            control={form.control}
            render={({ field }) => (
              <Input
                id="ticket-title"
                placeholder="Short description of the issue…"
                disabled={isPending}
                aria-invalid={!!form.formState.errors.title}
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  setErrorMessage("");
                }}
              />
            )}
          />
          <FieldError>{form.formState.errors.title?.message}</FieldError>
        </Field>

        {/* Description */}
        <Field>
          <FieldLabel htmlFor="ticket-description">Description</FieldLabel>
          <Controller
            name="description"
            control={form.control}
            render={({ field }) => (
              <Textarea
                id="ticket-description"
                placeholder="Add more details about the issue…"
                rows={4}
                className="resize-none"
                disabled={isPending}
                aria-invalid={!!form.formState.errors.description}
                {...field}
              />
            )}
          />
          <FieldError>{form.formState.errors.description?.message}</FieldError>
        </Field>
      </FieldGroup>

      <Separator className="my-4" />

      {/* Attributes row: Priority · Severity · Assignee */}
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex w-full flex-col items-center gap-2 sm:flex-row">
          <Field>
            <FieldLabel htmlFor="ticket-priority">Priority</FieldLabel>
            <Controller
              name="priority"
              control={form.control}
              render={({ field }) => (
                <PriorityDropdown
                  value={field.value}
                  onChange={field.onChange}
                  error={form.formState.errors.priority?.message}
                  disabled={isPending}
                />
              )}
            />
            <FieldError>{form.formState.errors.priority?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="ticket-severity">Severity</FieldLabel>
            <Controller
              name="severity"
              control={form.control}
              render={({ field }) => (
                <SeverityDropdown
                  value={field.value}
                  onChange={field.onChange}
                  error={form.formState.errors.severity?.message}
                  disabled={isPending}
                />
              )}
            />
            <FieldError>{form.formState.errors.severity?.message}</FieldError>
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="ticket-assignee">Assignee</FieldLabel>
          <Controller
            name="assignee"
            control={form.control}
            render={({ field }) => (
              <AssigneeDropdown
                value={field.value}
                onChange={field.onChange}
                error={form.formState.errors.assignee?.message}
                disabled={isPending}
              />
            )}
          />
          <FieldError>{form.formState.errors.assignee?.message}</FieldError>
        </Field>
      </div>

      {/* Footer actions */}
      <div className="flex justify-end gap-2 pt-1">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating…" : "Create ticket"}
        </Button>
      </div>
    </form>
  );
}

export default CreateTicketForm;
