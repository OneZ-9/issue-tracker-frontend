import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import CreateTicketForm from "@/features/ticket/CreateTicketForm";

type CreateTicketModalProps = {
  spaceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function CreateTicketModal({
  spaceId,
  open,
  onOpenChange,
}: CreateTicketModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create Ticket</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new ticket in this space.
          </DialogDescription>
        </DialogHeader>
        <CreateTicketForm
          spaceId={spaceId}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

export default CreateTicketModal;
