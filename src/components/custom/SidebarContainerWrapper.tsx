import { cn } from "@/lib/utils";

function SideBarPageContainerWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-0 flex min-h-auto w-full max-w-7xl flex-1 flex-col gap-4 space-y-8 p-4 px-4 pb-0 sm:px-6 lg:p-8 lg:px-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default SideBarPageContainerWrapper;
