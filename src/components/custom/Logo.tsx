import { TerminalIcon } from "lucide-react";

function Logo() {
  return (
    <a href="/" className="flex items-center gap-2">
      <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
        <TerminalIcon className="size-4" />
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">Issue Tracker</span>
        <span className="truncate text-xs">Your tickets in one place</span>
      </div>
    </a>
  );
}

export default Logo;
