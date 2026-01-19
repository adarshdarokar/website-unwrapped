import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  History,
  Settings,
  Command,
  GitCompare,
  Share2,
  Keyboard,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";

function dispatchAppEvent(name: string) {
  window.dispatchEvent(new CustomEvent(name));
}

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = useMemo(() => {
    const path = location.pathname;
    return {
      home: path === "/",
      history: path === "/history",
      settings: path === "/settings",
    };
  }, [location.pathname]);

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-sidebar-border">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/"
                    end
                    className="gap-2"
                    activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Analyze</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/history"
                    className="gap-2"
                    activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
                  >
                    <History className="h-4 w-4" />
                    <span>History</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/settings"
                    className="gap-2"
                    activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => dispatchAppEvent("app:commandPalette")}
                  className="gap-2"
                >
                  <Command className="h-4 w-4" />
                  <span>Command</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => dispatchAppEvent("app:compare")}
                  className="gap-2"
                >
                  <GitCompare className="h-4 w-4" />
                  <span>Compare</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => dispatchAppEvent("app:export")}
                  className="gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Export</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => dispatchAppEvent("app:shortcuts")}
                  className="gap-2"
                >
                  <Keyboard className="h-4 w-4" />
                  <span>Shortcuts</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Subtle route helpers */}
        {!isActive.home && (isActive.history || isActive.settings) && (
          <div className="px-2 pb-2">
            <button
              className="w-full text-left text-xs text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
              onClick={() => navigate("/")}
            >
              ← Back to Analyze
            </button>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
