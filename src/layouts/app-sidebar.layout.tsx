import { AppSidebar } from "@/components/app-sidebar";
import SideBarPageContainerWrapper from "@/components/custom/SidebarContainerWrapper";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router";

function AppSideBarLayout() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
        </header>
        <SideBarPageContainerWrapper>
          <Outlet />
        </SideBarPageContainerWrapper>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default AppSideBarLayout;
