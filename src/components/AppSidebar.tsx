import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  History,
  Settings,
  CreditCard,
  Command,
  GitCompare,
  Share2,
  Keyboard,
  ChevronRight,
  Sparkles,
  Crown,
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
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import { RazorpayCheckout } from "@/components/RazorpayCheckout";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

function dispatchAppEvent(name: string) {
  window.dispatchEvent(new CustomEvent(name));
}

const navItems = [
  { title: "Analyze", url: "/", icon: LayoutDashboard },
  { title: "History", url: "/history", icon: History },
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Pricing", url: "/pricing", icon: CreditCard },
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
  const { remaining, limit, isPaidUser, hasReachedLimit } = useUsageLimits();
  const { user } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);

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

  const handleUpgradeClick = () => {
    if (!user) {
      toast.info("Please sign in first to upgrade.");
      navigate("/auth");
      handleNavClick();
      return;
    }
    setShowCheckout(true);
  };

  const handlePaymentSuccess = () => {
    setShowCheckout(false);
    if (user) {
      localStorage.setItem(`webvision_paid_${user.id}`, "true");
    }
    toast.success("🎉 Welcome to Pro! Unlimited analyses unlocked.");
    window.location.reload();
  };

  const percentage = Math.round((remaining / limit) * 100);

  return (
    <>
      <Sidebar
        variant="sidebar"
        collapsible="icon"
        className="border-r border-sidebar-border/30 bg-sidebar/80 backdrop-blur-xl"
      >
        <SidebarContent className="px-2 pt-3">
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
                            "gap-3 transition-all duration-200 rounded-xl",
                            isActive && "bg-primary/10 text-primary font-medium shadow-sm"
                          )}
                          activeClassName="bg-primary/10 text-primary"
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
                      className="gap-3 transition-all duration-200 rounded-xl hover:bg-primary/5"
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
          {/* Upgrade Card */}
          {!isPaidUser && (
            <div className="group-data-[collapsible=icon]:hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/8 via-primary/4 to-transparent p-3.5 space-y-3 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-primary/12 flex items-center justify-center">
                  <Crown className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-xs font-semibold text-foreground">Upgrade to Pro</span>
              </div>

              {/* Usage bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">Credits used</span>
                  <span className={`text-[10px] font-medium ${hasReachedLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {remaining}/{limit} left
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-primary/10 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      hasReachedLimit ? 'bg-destructive' : remaining <= 2 ? 'bg-warning' : 'bg-primary/60'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              <button
                onClick={handleUpgradeClick}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Sparkles className="w-3 h-3" />
                Get Unlimited — $3/mo
              </button>
            </div>
          )}

          {/* Pro badge for paid users */}
          {isPaidUser && (
            <div className="group-data-[collapsible=icon]:hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/8 via-primary/4 to-transparent p-3.5 flex items-center gap-2.5 backdrop-blur-sm">
              <div className="w-7 h-7 rounded-xl bg-primary/12 flex items-center justify-center">
                <Crown className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <span className="text-xs font-semibold text-foreground">Pro Plan</span>
                <p className="text-[10px] text-muted-foreground">Unlimited analyses</p>
              </div>
            </div>
          )}

          {/* Collapsed icon upgrade button */}
          {!isPaidUser && (
            <button
              onClick={handleUpgradeClick}
              className="hidden group-data-[collapsible=icon]:flex w-8 h-8 items-center justify-center rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors mx-auto"
              title="Upgrade to Pro"
            >
              <Crown className="w-4 h-4 text-primary" />
            </button>
          )}

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

      <RazorpayCheckout
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        onSuccess={handlePaymentSuccess}
        amount={3}
        planName="Pro"
      />
    </>
  );
}
