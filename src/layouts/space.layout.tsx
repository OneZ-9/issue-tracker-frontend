import { NavLink, Outlet, useParams } from "react-router";

function SpaceLayout() {
  const { spaceId } = useParams<{ spaceId: string }>();

  return (
    <div className="flex flex-1 flex-col">
      <nav className="flex gap-2 border-b px-6 py-2">
        <NavLink
          to={`/issue-tracker/spaces/${spaceId}/board`}
          className={({ isActive }) =>
            `rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`
          }
        >
          Board
        </NavLink>
        <NavLink
          to={`/issue-tracker/spaces/${spaceId}/backlog`}
          className={({ isActive }) =>
            `rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`
          }
        >
          Backlog
        </NavLink>
      </nav>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

export default SpaceLayout;
