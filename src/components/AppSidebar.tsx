import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  History,
  Settings,
  Command,
  GitCompare,
  Share2,
  Keyboard,
  Crown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useUsageLimits } from "@/hooks/useUsageLimits";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
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
  { title: "Command", icon: Command, event: "app:commandPalette" },
  { title: "Compare", icon: GitCompare, event: "app:compare" },
  { title: "Export", icon: Share2, event: "app:export" },
  { title: "Shortcuts", icon: Keyboard, event: "app:shortcuts" },
];

interface RailItemProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
  expanded?: boolean;
  onClick: () => void;
}

function RailItem({ label, icon: Icon, active, expanded, onClick }: RailItemProps) {
  const button = (
    <button
      onClick={onClick}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={cn(
        "h-11 flex items-center rounded-lg transition-[color,background-color,box-shadow,transform] duration-200 ease-out overflow-hidden relative group",
        "active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
        expanded ? "w-full pl-3 pr-2.5 gap-2.5 justify-start" : "w-11 justify-center",
        active
          ? "bg-primary/10 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.18)]"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/55 focus-visible:bg-accent/55"
      )}
    >
      {active && (
        <span
          aria-hidden
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 w-0.5 rounded-r-full bg-primary",
            expanded ? "h-5" : "h-4"
          )}
        />
      )}
      <Icon className={cn("w-[19px] h-[19px] shrink-0 transition-transform duration-200", !active && "group-hover:scale-105")} />
      {expanded && (
        <span className={cn("text-[13px] truncate", active ? "font-semibold" : "font-medium")}>{label}</span>
      )}
    </button>
  );

  if (expanded) return button;

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={12} className="text-xs">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function RailContent({ expanded, onAction }: { expanded: boolean; onAction?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isPaidUser } = useUsageLimits();

  const go = (path: string) => {
    navigate(path);
    onAction?.();
  };

  return (
    <>
      <button
        onClick={() => go("/")}
        aria-label="web-vision home"
        className={cn(
          "flex items-center mb-4 min-w-0 rounded-xl transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]",
          expanded ? "px-0.5 justify-start" : "justify-center"
        )}
      >
        <Logo height={expanded ? 26 : 18} fitWidth={!expanded} priority />
      </button>

      {expanded && (
        <p className="px-2.5 mt-1 mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/60">
          Menu
        </p>
      )}
      <div className={cn("flex flex-col gap-1", expanded ? "items-stretch" : "items-center")}>
        {navItems.map((item) => (
          <RailItem
            key={item.title}
            label={item.title}
            icon={item.icon}
            expanded={expanded}
            active={location.pathname === item.url}
            onClick={() => go(item.url)}
          />
        ))}
      </div>

      <div className="my-3.5 h-px bg-gradient-to-r from-transparent via-border/70 to-transparent mx-1.5" />

      {expanded && (
        <p className="px-2.5 mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/60">
          Actions
        </p>
      )}
      <div className={cn("flex flex-col gap-1", expanded ? "items-stretch" : "items-center")}>
        {actionItems.map((item) => (
          <RailItem
            key={item.title}
            label={item.title}
            icon={item.icon}
            expanded={expanded}
            onClick={() => {
              dispatchAppEvent(item.event);
              onAction?.();
            }}
          />
        ))}
      </div>

      <div className={cn("mt-auto flex flex-col gap-2.5 pt-3.5", expanded ? "items-stretch" : "items-center")}>
        <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent mx-1" />
        <div className={cn("flex items-center", expanded ? "justify-between px-0.5" : "flex-col gap-2 justify-center")}>
          <ThemeToggle />
          {expanded && (
            <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70 font-medium">
              {isPaidUser ? "Pro" : "Free"}
            </span>
          )}
        </div>
        <button
          onClick={() => go('/pricing')}
          aria-label={isPaidUser ? "Pro plan" : "Upgrade to Pro"}
          className={cn(
            "group relative h-11 flex items-center rounded-xl overflow-hidden transition-all duration-300 ease-out",
            "bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5",
            "border border-primary/20 hover:border-primary/40",
            "shadow-[inset_0_1px_0_hsl(0_0%_100%/0.15)] hover:shadow-[0_8px_24px_-8px_hsl(var(--primary)/0.45)]",
            "text-primary hover:-translate-y-[1px] active:translate-y-0",
            expanded ? "w-full px-3 gap-2.5 justify-start" : "w-11 justify-center"
          )}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'radial-gradient(120% 80% at 0% 0%, hsl(var(--primary)/0.25), transparent 60%)' }}
          />
          <Crown className="w-[16px] h-[16px] shrink-0 relative drop-shadow-[0_0_6px_hsl(var(--primary)/0.45)]" />
          {expanded && (
            <span className="text-[13px] font-semibold tracking-tight truncate relative">
              {isPaidUser ? "Pro Active" : "Upgrade Pro"}
            </span>
          )}
        </button>
      </div>

      
    </>
  );
}

export function AppSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  // collapsed = compact icon-only rail (default). expanded = wider with labels.
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("webvision_sidebar_collapsed") !== "0";
  });

  useEffect(() => {
    const open = () => setMobileOpen(true);
    const toggleDesktop = () => setCollapsed((c) => !c);
    window.addEventListener("app:toggleSidebar", open);
    window.addEventListener("app:toggleSidebarDesktop", toggleDesktop);
    return () => {
      window.removeEventListener("app:toggleSidebar", open);
      window.removeEventListener("app:toggleSidebarDesktop", toggleDesktop);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("webvision_sidebar_collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  const railWidth = collapsed ? 64 : 232;

  return (
    <>
      {/* Desktop floating rail — always visible */}
      <aside
        style={{ width: railWidth }}
        className={cn(
          "hidden md:flex fixed top-3 bottom-3 left-3 z-30 flex-col rounded-2xl bg-sidebar/70 backdrop-blur-2xl border border-sidebar-border/50 shadow-[0_20px_60px_-20px_hsla(245,40%,20%,0.35),inset_0_1px_0_hsl(0_0%_100%/0.06)] overflow-hidden transition-[width] duration-300 ease-out",
          collapsed ? "px-2 py-3" : "px-3 py-3"
        )}
      >
        <div className="flex flex-col flex-1 min-h-0 min-w-0 overflow-hidden">
          <RailContent expanded={!collapsed} />
        </div>
      </aside>

      {/* Floating collapse/expand toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        style={{ left: railWidth - 2 }}
        className="hidden md:flex fixed top-[22px] z-40 w-8 h-8 items-center justify-center rounded-full bg-card border border-border/60 shadow-[0_6px_18px_-8px_hsla(245,40%,20%,0.45)] text-muted-foreground hover:text-primary hover:border-primary/40 hover:scale-105 active:scale-95 transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Spacer to reserve layout width on desktop */}
      <div
        style={{ width: railWidth + 18 }}
        className="hidden md:block flex-shrink-0 transition-[width] duration-300 ease-out"
        aria-hidden
      />

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-[248px] max-w-[calc(100vw-1rem)] p-3.5 bg-sidebar/95 backdrop-blur-xl border-sidebar-border/40 [&>button]:hidden overflow-hidden"
        >
          <div className="flex h-full flex-col items-stretch min-w-0 overflow-hidden">
            <RailContent expanded onAction={() => setMobileOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
