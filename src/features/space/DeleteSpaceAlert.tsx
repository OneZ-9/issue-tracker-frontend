import { useLocation, useNavigate } from "react-router";

import useDeleteSpace from "@/hooks/space/useDeleteSpace";
import type { Space } from "@/types/Space";
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
import { useToast } from "@/components/custom/Toast";

type DeleteSpaceAlertProps = {
  space: Space | null;
  onClose: () => void;
};

function DeleteSpaceAlert({ space, onClose }: DeleteSpaceAlertProps) {
  const { deleteSpaceApi, isPending } = useDeleteSpace();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const handleConfirm = () => {
    if (!space) return;
    const isActiveSpace = location.pathname.includes(space._id);
    deleteSpaceApi(
      { spaceId: space._id },
      {
        onSuccess: () => {
          showToast(
            "success",
            "Space deleted",
            `The space "${space.name}" was successfully deleted.`,
          );
          if (isActiveSpace) navigate("/issue-tracker/spaces");
        },
        onError: (error) =>
          showToast("error", "Failed to delete space", error.message),
        onSettled: onClose,
      },
    );
  };

  return (
    <AlertDialog open={!!space} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete "{space?.name}"?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the space and all its tickets. This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteSpaceAlert;
