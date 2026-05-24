import { useLocation } from "react-router";

import useSpaceById from "@/hooks/space/useSpaceById";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { LayersIcon } from "lucide-react";

function ActiveSpaceHeader() {
  const location = useLocation();

  // Extract spaceId from URL — exclude non-ID segments like "create"
  const match = location.pathname.match(/\/spaces\/([^/]+)/);
  const spaceId = match && match[1] !== "create" ? match[1] : null;

  const { space, isPending } = useSpaceById({ spaceId: spaceId ?? "" });

  if (!spaceId) return null;

  if (isPending) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="size-9 shrink-0 rounded" />
        <Skeleton className="h-6 w-28" />
      </div>
    );
  }

  if (!space) return null;

  return (
    <div className="flex items-center gap-2">
      <Avatar className="size-9 rounded">
        <AvatarFallback className="bg-muted rounded">
          <LayersIcon className="text-muted-foreground size-5" />
        </AvatarFallback>
      </Avatar>
      <span className="truncate text-xl font-bold">{space.name}</span>
    </div>
  );
}

export default ActiveSpaceHeader;
