import { PropsWithChildren, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Globe } from "lucide-react";

import { ThemeToggle } from "@/components/ThemeToggle";
import { UserMenu } from "@/components/UserMenu";
import { AppSidebar } from "@/components/AppSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

function getTitle(pathname: string) {
  if (pathname === "/") return "Analyze";
  if (pathname === "/history") return "History";
  if (pathname === "/settings") return "Settings";
  return "";
}

export function AppShell({ children }: PropsWithChildren) {
  const location = useLocation();
  const title = useMemo(() => getTitle(location.pathname), [location.pathname]);

  return (
    <SidebarProvider>
      <div className="min-h-svh flex w-full">
        <AppSidebar />

        <SidebarInset>
          <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
            <div className="h-14 px-3 sm:px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="mr-1" />
                <div className="hidden sm:flex items-center gap-2">
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <Globe className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-display font-semibold">WebVision</span>
                </div>
                <div className="ml-2 text-sm text-muted-foreground hidden md:block">
                  {title}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <ThemeToggle />
                <UserMenu />
              </div>
            </div>
          </header>

          <div className="flex-1">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
