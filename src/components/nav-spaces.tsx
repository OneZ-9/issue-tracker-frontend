"use client";

import { useState } from "react";
import { Link } from "react-router";
import useSpaces from "@/hooks/space/useSpaces";
import type { Space } from "@/types/Space";

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
  MoreHorizontalIcon,
  FolderIcon,
  Trash2Icon,
  PlusIcon,
  LayersIcon,
} from "lucide-react";

// Max spaces shown directly in the sidebar before collapsing to "More" popover
const VISIBLE_LIMIT = 3;

export function NavSpaces() {
  const { spaces, isPending } = useSpaces();
  const { isMobile } = useSidebar();

  // Track which space was last selected from the "More" popover so it
  // bubbles up to the first position in the visible list.
  const [pinnedId, setPinnedId] = useState<string | null>(null);

  // --- Ordering logic ---
  // If the user picked a space from the popover, move it to the front.
  const orderedSpaces: Space[] = pinnedId
    ? [
        ...spaces.filter((s: Space) => s._id === pinnedId),
        ...spaces.filter((s: Space) => s._id !== pinnedId),
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

  // --- Empty state: no spaces yet ---
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
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Spaces</SidebarGroupLabel>
      <SidebarMenu>
        {/* Render up to VISIBLE_LIMIT spaces */}
        {visibleSpaces.map((space) => (
          <SidebarMenuItem key={space._id}>
            <SidebarMenuButton asChild>
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
                  <Link to={`/issue-tracker/spaces/${space._id}`}>
                    <FolderIcon className="text-muted-foreground" />
                    <span>View Space</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {/* Destructive delete button — full bg+text destructive on hover/active */}
                <DropdownMenuItem asChild>
                  <button
                    type="button"
                    className="text-destructive focus:ring-destructive/50 hover:bg-destructive hover:text-destructive-foreground active:bg-destructive/10 active:text-destructive-foreground! flex w-full cursor-pointer items-center gap-2 px-2 py-1 focus:ring-2 focus:outline-none"
                  >
                    <Trash2Icon className="text-destructive size-4" />
                    <span>Delete Space</span>
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}

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
                {/* Scrollable list of overflow spaces */}
                <ScrollArea className="max-h-64">
                  <div className="p-1">
                    {overflowSpaces.map((space) => (
                      <Button
                        key={space._id}
                        variant="ghost"
                        className="w-full justify-start gap-2 font-normal"
                        asChild
                        onClick={() => {
                          // Pin selected space to the top of the visible list
                          setPinnedId(space._id);
                        }}
                      >
                        <Link to={`/issue-tracker/spaces/${space._id}`}>
                          <LayersIcon className="text-muted-foreground size-4 shrink-0" />
                          <span className="truncate">{space.name}</span>
                        </Link>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
