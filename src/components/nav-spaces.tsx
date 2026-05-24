"use client";

import { useState } from "react";
import { Link, useLocation } from "react-router";
import useSpaces from "@/hooks/space/useSpaces";
import type { Space } from "@/types/Space";
import DeleteSpaceAlert from "@/features/space/DeleteSpaceAlert";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  LayersIcon,
  MoreHorizontalIcon,
  Trash2Icon,
  PlusIcon,
  Settings2,
} from "lucide-react";

// Max spaces shown directly in the sidebar before collapsing to "More" popover
const VISIBLE_LIMIT = 3;

export function NavSpaces() {
  const { spaces, isPending } = useSpaces();
  const { isMobile } = useSidebar();
  const location = useLocation();

  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [spaceToDelete, setSpaceToDelete] = useState<Space | null>(null);

  // Detect the currently active space from the URL path
  // e.g. /issue-tracker/spaces/abc123/board → active = "abc123"
  const activeSpaceId = (() => {
    const match = location.pathname.match(/\/spaces\/([^/]+)/);
    return match ? match[1] : null;
  })();

  // --- Ordering logic ---
  // If there is an active space, always pin it to the front of visible list.
  // Fall back to manually pinned id from "More" click.
  const effectivePinnedId = activeSpaceId ?? pinnedId;
  const orderedSpaces: Space[] = effectivePinnedId
    ? [
        ...spaces.filter((s: Space) => s._id === effectivePinnedId),
        ...spaces.filter((s: Space) => s._id !== effectivePinnedId),
      ]
    : spaces;

  const visibleSpaces = orderedSpaces.slice(0, VISIBLE_LIMIT);
  const overflowSpaces = orderedSpaces.slice(VISIBLE_LIMIT);

  // --- Loading skeleton ---
  if (isPending) {
    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Spaces</SidebarGroupLabel>
        <SidebarMenu>
          {[1, 2, 3].map((i) => (
            <SidebarMenuItem key={i}>
              <Skeleton className="h-8 w-full rounded-md" />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  // Empty state: no spaces yet
  if (spaces.length === 0) {
    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Spaces</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/issue-tracker/spaces/create">
                <PlusIcon />
                <span>Create Space</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Spaces</SidebarGroupLabel>
        <SidebarMenu>
          {/* Render up to VISIBLE_LIMIT spaces */}
          {visibleSpaces.map((space) => {
            const isActive = space._id === activeSpaceId;
            return (
              <SidebarMenuItem key={space._id}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link to={`/issue-tracker/spaces/${space._id}`}>
                    <LayersIcon />
                    <span>{space.name}</span>
                  </Link>
                </SidebarMenuButton>

                {/* Per-space actions dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction
                      showOnHover
                      className="aria-expanded:bg-muted"
                    >
                      <MoreHorizontalIcon />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-48"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                  >
                    <DropdownMenuItem asChild>
                      <Link to={`/issue-tracker/spaces/${space._id}/update`}>
                        <Settings2 className="text-muted-foreground" />
                        <span>Update Space</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <button
                        type="button"
                        className="text-destructive focus:ring-destructive/50 hover:bg-destructive hover:text-destructive-foreground active:bg-destructive/10 active:text-destructive-foreground! flex w-full cursor-pointer items-center gap-2 px-2 py-1 focus:ring-2 focus:outline-none"
                        onClick={() => setSpaceToDelete(space)}
                      >
                        <Trash2Icon className="text-destructive size-4" />
                        <span>Delete Space</span>
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            );
          })}

          {/* "More" button — only shown when there are overflow spaces */}
          {overflowSpaces.length > 0 && (
            <SidebarMenuItem>
              <Popover>
                <PopoverTrigger asChild>
                  <SidebarMenuButton>
                    <MoreHorizontalIcon />
                    <span>More</span>
                  </SidebarMenuButton>
                </PopoverTrigger>
                <PopoverContent
                  className="w-56 p-0"
                  side={isMobile ? "bottom" : "right"}
                  align="start"
                >
                  <ScrollArea className="max-h-64">
                    <div className="p-1">
                      {overflowSpaces.map((space) => {
                        const isActive = space._id === activeSpaceId;
                        return (
                          <Button
                            key={space._id}
                            variant={isActive ? "secondary" : "ghost"}
                            className="w-full justify-start gap-2 font-normal"
                            asChild
                            onClick={() => setPinnedId(space._id)}
                          >
                            <Link to={`/issue-tracker/spaces/${space._id}`}>
                              <LayersIcon className="size-4 shrink-0" />
                              <span className="truncate">{space.name}</span>
                            </Link>
                          </Button>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </PopoverContent>
              </Popover>
            </SidebarMenuItem>
          )}

          {/* Create Space — always visible */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/issue-tracker/spaces/create">
                <PlusIcon />
                <span>New Space</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <DeleteSpaceAlert
        space={spaceToDelete}
        onClose={() => setSpaceToDelete(null)}
      />
    </>
  );
}
