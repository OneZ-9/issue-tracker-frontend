import { useState, useEffect, useRef } from "react";

import TicketStatusDropdown from "@/components/custom/TicketStatusDropdown";
import PriorityDropdown from "@/components/custom/PriorityDropdown";
import SeverityDropdown from "@/components/custom/SeverityDropdown";
import AssigneeDropdown from "@/components/custom/AssigneeDropdown";
import { useToast } from "@/components/custom/Toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import useUpdateTicket from "@/hooks/ticket/useUpdateTicket";
import type { Ticket, TicketPriority, TicketSeverity } from "@/types/Ticket";
import type { User } from "@/types/User";

type UpdateTicketFormProps = {
  ticket: Ticket;
  spaceId: string;
};

function getAssigneeId(assignee: Ticket["assignee"]): string | null {
  if (!assignee) return null;
  if (typeof assignee === "object")
    return (assignee as Partial<User>)._id ?? null;
  return assignee;
}

function getUser(value: string | Partial<User> | null): Partial<User> | null {
  if (!value || typeof value !== "object") return null;
  return value as Partial<User>;
}

function UpdateTicketForm({ ticket, spaceId }: UpdateTicketFormProps) {
  const { updateTicketApi, isPending } = useUpdateTicket();
  const { showToast } = useToast();

  /* ── Inline edit: title ──────────────────────────────── */
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(ticket.title);
  const titleRef = useRef<HTMLInputElement>(null);

  /* ── Inline edit: description ────────────────────────── */
  const [editingDesc, setEditingDesc] = useState(false);
  const [descValue, setDescValue] = useState(ticket.description ?? "");
  const descRef = useRef<HTMLTextAreaElement>(null);

  /* ── Staged dropdown changes ─────────────────────────── */
  const [pendingPriority, setPendingPriority] = useState<
    TicketPriority | undefined
  >(ticket.priority);
  const [pendingSeverity, setPendingSeverity] = useState<
    TicketSeverity | undefined
  >(ticket.severity);
  const [pendingAssignee, setPendingAssignee] = useState<string | null>(
    getAssigneeId(ticket.assignee),
  );

  // Reset when ticket changes
  useEffect(() => {
    setTitleValue(ticket.title);
    setDescValue(ticket.description ?? "");
    setPendingPriority(ticket.priority);
    setPendingSeverity(ticket.severity);
    setPendingAssignee(getAssigneeId(ticket.assignee));
    setEditingTitle(false);
    setEditingDesc(false);
  }, [ticket._id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-focus when entering edit mode
  useEffect(() => {
    if (editingTitle) titleRef.current?.focus();
  }, [editingTitle]);

  useEffect(() => {
    if (editingDesc) descRef.current?.focus();
  }, [editingDesc]);

  const originalAssigneeId = getAssigneeId(ticket.assignee);
  const attributesDirty =
    pendingPriority !== ticket.priority ||
    pendingSeverity !== ticket.severity ||
    pendingAssignee !== originalAssigneeId;

  const reporter = getUser(ticket.reporter);

  /* ── Title auto-save ─────────────────────────────────── */
  const handleTitleSave = () => {
    setEditingTitle(false);
    const trimmed = titleValue.trim();
    if (!trimmed || trimmed === ticket.title) {
      setTitleValue(ticket.title);
      return;
    }
    updateTicketApi(
      { spaceId, ticketId: ticket._id, reqBody: { title: trimmed } },
      {
        onError: (e) => {
          showToast(
            "error",
            "Failed to update title",
            e.response?.data?.message ?? e.message,
          );
          setTitleValue(ticket.title);
        },
      },
    );
  };

  /* ── Description auto-save ───────────────────────────── */
  const handleDescSave = () => {
    setEditingDesc(false);
    if (descValue === (ticket.description ?? "")) return;
    updateTicketApi(
      { spaceId, ticketId: ticket._id, reqBody: { description: descValue } },
      {
        onError: (e) => {
          showToast(
            "error",
            "Failed to update description",
            e.response?.data?.message ?? e.message,
          );
          setDescValue(ticket.description ?? "");
        },
      },
    );
  };

  /* ── Attribute save ──────────────────────────────────── */
  const handleSaveAttributes = () => {
    updateTicketApi(
      {
        spaceId,
        ticketId: ticket._id,
        reqBody: {
          priority: pendingPriority,
          severity: pendingSeverity,
          assignee: pendingAssignee,
        },
      },
      {
        onSuccess: () =>
          showToast("success", "Ticket updated", "Changes saved."),
        onError: (e) =>
          showToast(
            "error",
            "Failed to save changes",
            e.response?.data?.message ?? e.message,
          ),
      },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Status */}
      <div>
        <TicketStatusDropdown
          spaceId={spaceId}
          ticketId={ticket._id}
          currentStatus={ticket.status}
          disabled={isPending}
        />
      </div>

      {/* Title */}
      <div>
        <p className="text-muted-foreground mb-1.5 text-xs font-medium tracking-wide uppercase">
          Title
        </p>
        {editingTitle ? (
          <Input
            ref={titleRef}
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
              if (e.key === "Escape") {
                setTitleValue(ticket.title);
                setEditingTitle(false);
              }
            }}
            disabled={isPending}
            className="text-sm"
          />
        ) : (
          <p
            className="hover:bg-accent min-h-8 cursor-text rounded px-3 py-1.5 text-sm leading-relaxed"
            onClick={() => setEditingTitle(true)}
          >
            {titleValue || (
              <span className="text-muted-foreground italic">
                Click to add title
              </span>
            )}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <p className="text-muted-foreground mb-1.5 text-xs font-medium tracking-wide uppercase">
          Description
        </p>
        {editingDesc ? (
          <textarea
            ref={descRef}
            value={descValue}
            onChange={(e) => setDescValue(e.target.value)}
            onBlur={handleDescSave}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setDescValue(ticket.description ?? "");
                setEditingDesc(false);
              }
            }}
            rows={6}
            disabled={isPending}
            title="Description"
            placeholder="Add a description…"
            className="border-input focus-visible:ring-ring w-full resize-none rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none disabled:opacity-50"
          />
        ) : (
          <p
            className={cn(
              "hover:bg-accent min-h-24 cursor-text rounded px-3 py-1.5 text-sm leading-relaxed whitespace-pre-wrap",
              !descValue && "text-muted-foreground italic",
            )}
            onClick={() => setEditingDesc(true)}
          >
            {descValue || "Click to add description"}
          </p>
        )}
      </div>

      <Separator />

      {/* Attributes grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <p className="text-muted-foreground mb-1.5 text-xs font-medium tracking-wide uppercase">
            Priority
          </p>
          <PriorityDropdown
            value={pendingPriority}
            onChange={(v) =>
              setPendingPriority(v as TicketPriority | undefined)
            }
            disabled={isPending}
            className="w-full"
          />
        </div>

        <div>
          <p className="text-muted-foreground mb-1.5 text-xs font-medium tracking-wide uppercase">
            Severity
          </p>
          <SeverityDropdown
            value={pendingSeverity}
            onChange={(v) =>
              setPendingSeverity(v as TicketSeverity | undefined)
            }
            disabled={isPending}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <p className="text-muted-foreground mb-1.5 text-xs font-medium tracking-wide uppercase">
            Assignee
          </p>
          <AssigneeDropdown
            value={pendingAssignee}
            onChange={(v) => setPendingAssignee(v)}
            disabled={isPending}
            className="w-full"
          />
        </div>

        <div>
          <p className="text-muted-foreground mb-1.5 text-xs font-medium tracking-wide uppercase">
            Reporter
          </p>
          {reporter?.name ? (
            <div className="flex items-center gap-2 px-1 py-1">
              <Avatar className="size-6">
                <AvatarFallback className="text-xs">
                  {reporter.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{reporter.name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground px-1 py-1 text-sm">
              Unknown
            </span>
          )}
        </div>
      </div>

      {/* Save attributes button — only visible when dirty */}
      {attributesDirty && (
        <div className="flex justify-end">
          <Button size="sm" onClick={handleSaveAttributes} disabled={isPending}>
            {isPending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      )}

      <Separator />

      {/* Metadata */}
      <div className="text-muted-foreground space-y-1.5 text-xs">
        <div className="flex justify-between">
          <span>Ticket ID</span>
          <span className="font-mono">{ticket.ticketId}</span>
        </div>
        <div className="flex justify-between">
          <span>Created</span>
          <span>
            {new Date(ticket.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Updated</span>
          <span>
            {new Date(ticket.updatedAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

export default UpdateTicketForm;
