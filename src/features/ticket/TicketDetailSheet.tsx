import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import useTicketById from "@/hooks/ticket/useTicketById";
import UpdateTicketForm from "@/features/ticket/UpdateTicketForm";

type TicketDetailSheetProps = {
  spaceId: string;
  ticketId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function TicketDetailSheet({
  spaceId,
  ticketId,
  open,
  onOpenChange,
}: TicketDetailSheetProps) {
  const { ticket, isPending } = useTicketById({
    spaceId,
    ticketId: ticketId ?? "",
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-full p-0 sm:w-160 sm:max-w-160"
      >
        {isPending ? (
          <div className="space-y-4 p-6">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="mt-4 h-28 w-full" />
            <div className="grid grid-cols-2 gap-4 pt-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ) : ticket ? (
          <>
            <SheetHeader className="border-b px-6 py-4">
              <SheetTitle className="text-muted-foreground font-mono text-sm font-normal">
                {ticket.ticketId}
              </SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-5rem)]">
              <div className="px-6 py-5 pb-10">
                <UpdateTicketForm ticket={ticket} spaceId={spaceId} />
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
            Ticket not found.
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default TicketDetailSheet;
