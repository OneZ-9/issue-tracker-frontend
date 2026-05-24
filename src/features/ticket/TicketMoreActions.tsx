import { useState } from "react";
import { MoreHorizontalIcon, EyeIcon, Trash2Icon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useDeleteTicket from "@/hooks/ticket/useDeleteTicket";
import { useToast } from "@/components/custom/Toast";
import type { Ticket } from "@/types/Ticket";

type TicketMoreActionsProps = {
  ticket: Ticket;
  spaceId: string;
  onView: () => void;
};

function TicketMoreActions({
  ticket,
  spaceId,
  onView,
}: TicketMoreActionsProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { deleteTicketApi, isPending } = useDeleteTicket();
  const { showToast } = useToast();

  const handleDelete = () => {
    deleteTicketApi(
      { spaceId, ticketId: ticket._id },
      {
        onSuccess: () =>
          showToast(
            "success",
            "Ticket deleted",
            `"${ticket.title}" was permanently deleted.`,
          ),
        onError: (e) =>
          showToast(
            "error",
            "Failed to delete ticket",
            e.response?.data?.message ?? e.message,
          ),
        onSettled: () => setDeleteOpen(false),
      },
    );
  };

  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontalIcon className="size-4" />
            <span className="sr-only">More actions</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-40 p-1"
          align="end"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="hover:bg-accent flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors"
            onClick={() => {
              setPopoverOpen(false);
              onView();
            }}
          >
            <EyeIcon className="text-muted-foreground size-4" />
            View Ticket
          </button>
          {/* <Separator className="my-1" /> */}
          <button
            type="button"
            className="hover:bg-destructive/10 text-destructive flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors"
            onClick={() => {
              setPopoverOpen(false);
              setDeleteOpen(true);
            }}
          >
            <Trash2Icon className="size-4" />
            Delete
          </button>
        </PopoverContent>
      </Popover>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete ticket?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{ticket.title}&quot;. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default TicketMoreActions;
