import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";

import useSpaces from "@/hooks/space/useSpaces";
import useDeleteSpace from "@/hooks/space/useDeleteSpace";
import type { Space } from "@/types/Space";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  LayersIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { useToast } from "@/components/custom/Toast";

const VISIBLE_LIMIT = 3;

function SpaceRow({
  space,
  onDelete,
}: {
  space: Space;
  onDelete: (space: Space) => void;
}) {
  const navigate = useNavigate();

  return (
    <div
      className="group hover:bg-accent/50 bg-card flex cursor-pointer items-center gap-4 rounded-xl border px-5 py-4 transition-colors"
      onClick={() => navigate(`/issue-tracker/spaces/${space._id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/issue-tracker/spaces/${space._id}`);
        }
      }}
    >
      {/* shadcn Avatar with LayersIcon fallback */}
      <Avatar className="size-11 rounded-lg">
        <AvatarFallback className="bg-muted rounded-lg">
          <LayersIcon className="text-muted-foreground size-5" />
        </AvatarFallback>
      </Avatar>

      {/* Name + spaceKey + description */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-semibold">{space.name}</span>
          {space.spaceKey && (
            <Badge
              variant="secondary"
              className="shrink-0 rounded-lg font-mono text-xs"
            >
              {space.spaceKey}
            </Badge>
          )}
        </div>
        {space.description ? (
          <p className="text-muted-foreground mt-0.5 truncate text-sm">
            {space.description}
          </p>
        ) : (
          <p className="text-muted-foreground/40 mt-0.5 truncate text-sm italic">
            No description
          </p>
        )}
      </div>

      {/* Actions — fade in on hover */}
      <div
        className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground size-8"
          asChild
        >
          <Link to={`/issue-tracker/spaces/${space._id}/update`}>
            <PencilIcon className="size-4" />
            <span className="sr-only">Edit {space.name}</span>
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hover:text-destructive hover:bg-destructive/10 text-muted-foreground size-8"
          onClick={() => onDelete(space)}
        >
          <Trash2Icon className="size-4" />
          <span className="sr-only">Delete {space.name}</span>
        </Button>
      </div>
    </div>
  );
}

function SpaceRowSkeleton() {
  return (
    <div className="bg-card flex items-center gap-4 rounded-xl border px-5 py-4">
      <Skeleton className="size-11 shrink-0 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-64" />
      </div>
      <Skeleton className="h-8 w-16 shrink-0 rounded-lg" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-card flex flex-col items-center justify-center rounded-2xl border border-dashed px-8 py-20 text-center">
      <div className="bg-muted ring-muted/50 mb-6 flex size-20 items-center justify-center rounded-2xl ring-4">
        <LayersIcon className="text-muted-foreground size-9" />
      </div>
      <h2 className="mb-2 text-xl font-semibold tracking-tight">
        Create your first space
      </h2>
      <p className="text-muted-foreground mb-8 max-w-sm text-sm leading-relaxed">
        Spaces are where your team's work lives. Organise tickets into boards
        and backlogs — each space is its own focused workspace.
      </p>
      <Button asChild size="lg" className="gap-2">
        <Link to="/issue-tracker/spaces/create">
          <PlusIcon className="size-4" />
          Create Space
        </Link>
      </Button>
    </div>
  );
}

function Spaces() {
  const { spaces, isPending } = useSpaces();
  const { showToast } = useToast();
  const { deleteSpaceApi, isPending: isDeleting } = useDeleteSpace();
  const location = useLocation();

  const [spaceToDelete, setSpaceToDelete] = useState<Space | null>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);

  // Detect the selected space from the URL
  const activeSpaceId = (() => {
    const match = location.pathname.match(/\/spaces\/([^/]+)/);
    return match ? match[1] : null;
  })();

  // Active space floats to front, then manual pin, then original order
  const effectivePinnedId = activeSpaceId ?? pinnedId;
  const orderedSpaces: Space[] = effectivePinnedId
    ? [
        ...spaces.filter((s: Space) => s._id === effectivePinnedId),
        ...spaces.filter((s: Space) => s._id !== effectivePinnedId),
      ]
    : spaces;

  const visibleSpaces = orderedSpaces.slice(0, VISIBLE_LIMIT);
  const overflowSpaces = orderedSpaces.slice(VISIBLE_LIMIT);

  const handleDeleteConfirm = () => {
    if (!spaceToDelete) return;
    deleteSpaceApi(
      { spaceId: spaceToDelete._id },
      {
        onSuccess: () =>
          showToast(
            "success",
            "Space deleted",
            `The space "${spaceToDelete.name}" was successfully deleted.`,
          ),
        onError: (error) =>
          showToast("error", "Failed to delete space", error.message),
        onSettled: () => setSpaceToDelete(null),
      },
    );
  };

  // Spaces list loading state
  if (isPending) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <SpaceRowSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty state: no spaces
  if (spaces.length === 0) {
    return <EmptyState />;
  }

  //Spaces list with More button and delete dialog
  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-2">
        {visibleSpaces.map((space: Space) => (
          <SpaceRow key={space._id} space={space} onDelete={setSpaceToDelete} />
        ))}
      </div>

      {/* More button for overflow spaces */}
      {overflowSpaces.length > 0 && (
        <div className="mt-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground gap-1.5"
              >
                <MoreHorizontalIcon className="size-4" />
                {overflowSpaces.length} more space
                {overflowSpaces.length > 1 ? "s" : ""}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-72 p-1">
              <ScrollArea className="max-h-64">
                {overflowSpaces.map((space: Space) => (
                  <button
                    key={space._id}
                    type="button"
                    className="hover:bg-accent flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors"
                    onClick={() => setPinnedId(space._id)}
                  >
                    <Avatar className="size-8 rounded-lg">
                      <AvatarFallback className="bg-muted rounded-lg">
                        <LayersIcon className="text-muted-foreground size-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {space.name}
                      </p>
                      {space.spaceKey && (
                        <p className="text-muted-foreground truncate font-mono text-xs">
                          {space.spaceKey}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Always-visible create button */}
      <div className="mt-4">
        <Button variant="outline" asChild className="gap-2">
          <Link to="/issue-tracker/spaces/create">
            <PlusIcon className="size-4" />
            New Space
          </Link>
        </Button>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={!!spaceToDelete}
        onOpenChange={(open) => !open && setSpaceToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{spaceToDelete?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the space and all its tickets. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default Spaces;
