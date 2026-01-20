import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  History,
  Settings,
  Command,
  GitCompare,
  Share2,
  Keyboard,
  ChevronRight,
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
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";

function dispatchAppEvent(name: string) {
  window.dispatchEvent(new CustomEvent(name));
}

const navItems = [
  { title: "Analyze", url: "/", icon: LayoutDashboard },
  { title: "History", url: "/history", icon: History },
  { title: "Settings", url: "/settings", icon: Settings },
];

const actionItems = [
  { title: "Command", icon: Command, event: "app:commandPalette", shortcut: "⌘K" },
  { title: "Compare", icon: GitCompare, event: "app:compare" },
  { title: "Export", icon: Share2, event: "app:export" },
  { title: "Shortcuts", icon: Keyboard, event: "app:shortcuts", shortcut: "?" },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setOpenMobile, isMobile } = useSidebar();
  
  const currentPath = location.pathname;

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleActionClick = (event: string) => {
    dispatchAppEvent(event);
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar 
      variant="sidebar" 
      collapsible="icon" 
      className="border-r border-sidebar-border/50"
    >
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <LayoutDashboard className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display font-semibold text-sm group-data-[collapsible=icon]:hidden">
            WebVision
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium mb-1">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = currentPath === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      tooltip={item.title}
                      isActive={isActive}
                    >
                      <NavLink
                        to={item.url}
                        end={item.url === "/"}
                        onClick={handleNavClick}
                        className={cn(
                          "gap-3 transition-all duration-200",
                          isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        )}
                        activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                        {isActive && (
                          <ChevronRight className="ml-auto h-3 w-3 opacity-50 group-data-[collapsible=icon]:hidden" />
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-2" />

        {/* Actions */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium mb-1">
            Quick Actions
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {actionItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => handleActionClick(item.event)}
                    tooltip={item.title}
                    className="gap-3 transition-all duration-200"
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="group-data-[collapsible=icon]:hidden flex-1">{item.title}</span>
                    {item.shortcut && (
                      <span className="text-[10px] text-muted-foreground/50 bg-muted/50 px-1.5 py-0.5 rounded font-mono group-data-[collapsible=icon]:hidden">
                        {item.shortcut}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 group-data-[collapsible=icon]:p-2">
        {currentPath !== "/" && (
          <button
            onClick={() => {
              navigate("/");
              handleNavClick();
            }}
            className="w-full text-left text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors py-2 px-2 rounded-md hover:bg-sidebar-accent/50 group-data-[collapsible=icon]:hidden"
          >
            ← Back to Analyze
          </button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
