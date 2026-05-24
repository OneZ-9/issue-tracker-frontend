import { useState } from "react";
import { CheckIcon, ChevronDownIcon, UserIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import useUsers from "@/hooks/user/useUsers";
import type { User } from "@/types/User";

type AssigneeDropdownProps = {
  value?: string | null;
  onChange: (value: string | null) => void;
  error?: string;
  className?: string;
  disabled?: boolean;
};

function AssigneeDropdown({
  value,
  onChange,
  error,
  className,
  disabled,
}: AssigneeDropdownProps) {
  const [open, setOpen] = useState(false);
  const { users, isPending } = useUsers();

  const selectedUser = users?.find((u: User) => u._id === value) ?? null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          className={cn(
            "h-10 justify-start gap-1.5 text-sm",
            error && "border-destructive",
            className,
          )}
        >
          {selectedUser ? (
            <>
              <Avatar className="size-4 shrink-0">
                <AvatarFallback className="text-[9px]">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">{selectedUser.name}</span>
            </>
          ) : (
            <span className="text-muted-foreground">Assignee</span>
          )}
          <ChevronDownIcon className="ml-auto size-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-1" align="start">
        {isPending ? (
          <div className="space-y-1 p-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2 px-2 py-1.5">
                <Skeleton className="size-5 shrink-0 rounded-full" />
                <Skeleton className="h-3 w-28" />
              </div>
            ))}
          </div>
        ) : !users || users.length === 0 ? (
          <p className="text-muted-foreground p-3 text-center text-sm">
            No users to show
          </p>
        ) : (
          <ScrollArea className="max-h-52">
            {/* Clear assignee option */}
            <button
              type="button"
              className="hover:bg-accent flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors"
              onClick={() => {
                onChange(null);
                setOpen(false);
              }}
            >
              <div className="bg-muted flex size-5 shrink-0 items-center justify-center rounded-full">
                <UserIcon className="text-muted-foreground size-3" />
              </div>
              <span className="text-muted-foreground">No assignee</span>
              {!value && <CheckIcon className="ml-auto size-3.5 opacity-60" />}
            </button>

            {users.map((user: User) => (
              <button
                key={user._id}
                type="button"
                className="hover:bg-accent flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors"
                onClick={() => {
                  onChange(user._id);
                  setOpen(false);
                }}
              >
                <Avatar className="size-5 shrink-0">
                  <AvatarFallback className="text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate">{user.name}</span>
                {value === user._id && (
                  <CheckIcon className="ml-auto size-3.5 opacity-60" />
                )}
              </button>
            ))}
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default AssigneeDropdown;
