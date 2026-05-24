import { useState } from "react";
import { NavLink, Outlet, useParams } from "react-router";
import { Columns3, PlusIcon, Rows3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import CreateTicketModal from "@/features/ticket/CreateTicketModal";

function SpaceLayout() {
  const { spaceId } = useParams<{ spaceId: string }>();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col">
      <nav className="flex items-center gap-2 border-b px-6 py-2">
        <NavLink
          to={`/issue-tracker/spaces/${spaceId}/board`}
          className={({ isActive }) =>
            `flex items-center rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`
          }
        >
          <Columns3 className="mr-2 size-4" /> Board
        </NavLink>
        <NavLink
          to={`/issue-tracker/spaces/${spaceId}/backlog`}
          className={({ isActive }) =>
            `flex items-center rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`
          }
        >
          <Rows3 className="mr-2 size-4" /> Backlog
        </NavLink>

        <Button
          size="sm"
          className="ml-auto h-9 gap-1.5"
          onClick={() => setCreateOpen(true)}
        >
          <PlusIcon className="size-4" />
          Create
        </Button>
      </nav>

      <div className="flex-1">
        <Outlet />
      </div>

      {spaceId && (
        <CreateTicketModal
          spaceId={spaceId}
          open={createOpen}
          onOpenChange={setCreateOpen}
        />
      )}
    </div>
  );
}

export default SpaceLayout;
